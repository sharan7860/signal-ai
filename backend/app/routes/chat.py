"""Keep provider credentials and instructions on the server."""
from collections import OrderedDict, deque
from datetime import datetime, timezone
import logging
import re
from threading import Lock
import time

import requests
from fastapi import APIRouter, HTTPException, Request

from app.config import settings
from app.models.schemas import ChatRequest
from app.services import StockService

router = APIRouter(prefix="/api/chat", tags=["Chat"])
logger = logging.getLogger(__name__)
_requests = OrderedDict()
_lock = Lock()
SYSTEM_PROMPT = (
    "You are Trader AI, an educational stock market assistant. Explain indicators, "
    "diversification and market concepts clearly. When a market-data snapshot is provided "
    "below, use its values to answer questions about that ticker. It is the latest data "
    "available from the market-data provider and can be delayed. Never invent prices, news, "
    "sources, or values that are absent from the snapshot. Distinguish general analysis "
    "from personalized advice and state uncertainty."
)
COMMON_WORDS = {"A", "AN", "AND", "ARE", "FOR", "HOW", "I", "IN", "IS", "IT", "OF", "ON", "OR", "RSI", "THE", "TO", "WHAT", "WITH"}


def requested_ticker(question):
    """Find an explicitly named ticker without treating ordinary words as symbols."""
    standalone = re.fullmatch(r"\s*\$?([A-Za-z]{1,5})\s*[?!.]*\s*", question)
    if standalone:
        symbol = standalone.group(1).upper()
        if symbol not in COMMON_WORDS:
            return symbol
    candidates = re.findall(r"\$([A-Za-z]{1,5})\b|\b([A-Z]{1,5})\b", question)
    for dollar_symbol, uppercase_symbol in candidates:
        symbol = (dollar_symbol or uppercase_symbol).upper()
        if symbol not in COMMON_WORDS:
            return symbol
    contextual = re.search(
        r"\b(?:about|analy[sz]e|analysis|chart|for|of|price|quote|stock|ticker)\s+(?:of\s+)?\$?([A-Za-z]{1,5})\b",
        question,
        flags=re.IGNORECASE,
    )
    if contextual:
        symbol = contextual.group(1).upper()
        if symbol not in COMMON_WORDS:
            return symbol
    before_metric = re.search(
        r"\b([A-Za-z]{1,5})\s+(?:analysis|chart|price|quote|rsi|stock|ticker)\b",
        question,
        flags=re.IGNORECASE,
    )
    if before_metric:
        symbol = before_metric.group(1).upper()
        if symbol not in COMMON_WORDS:
            return symbol
    return None


def market_snapshot(question):
    """Load the latest available quote and indicators for a requested ticker."""
    symbol = requested_ticker(question)
    if not symbol:
        return None
    try:
        quote = StockService.get_stock_quote(symbol, "1y")
        indicators = StockService.calculate_technical_indicators(symbol)
        headlines = StockService.get_stock_news(symbol, limit=3)
    except Exception as exc:
        logger.warning("Could not load a market snapshot for %s (%s)", symbol, type(exc).__name__)
        return None
    fields = {
        "ticker": quote["symbol"],
        "company": quote.get("company_name"),
        "currency": quote.get("currency"),
        "latest_price": quote.get("current_price"),
        "change_percent": quote.get("percentage_change"),
        "previous_close": quote.get("previous_close"),
        "day_high": quote.get("high_price"),
        "day_low": quote.get("low_price"),
        "volume": quote.get("volume"),
        "ma_20": indicators.get("ma_20"),
        "ma_50": indicators.get("ma_50"),
        "ma_200": indicators.get("ma_200"),
        "rsi_14": indicators.get("rsi"),
        "macd": indicators.get("macd"),
        "macd_signal": indicators.get("macd_signal"),
        "snapshot_time_utc": quote["timestamp"].isoformat(),
    }
    snapshot = "MARKET DATA SNAPSHOT (use only these values for current-market claims):\n" + "\n".join(
        f"{name}: {value}" for name, value in fields.items() if value is not None
    )
    if headlines:
        snapshot += "\nLATEST PROVIDER HEADLINES (cite the publisher and do not add facts beyond these titles):\n" + "\n".join(
            f"- {article['publisher']}: {article['title']}" for article in headlines
        )
    return snapshot


def local_reference_response(question):
    """Provide a useful, clearly limited answer when the hosted model is unavailable."""
    question = question.lower()
    prefix = "The hosted AI response is unavailable, so this is a limited local reference answer. "
    if "rsi" in question:
        return prefix + (
            "RSI, or Relative Strength Index, measures recent price momentum on a scale from 0 to 100. "
            "Values above 70 are commonly treated as overbought and values below 30 as oversold, but neither is a trade signal by itself."
        )
    if "macd" in question:
        return prefix + (
            "MACD compares two exponential moving averages to show momentum. A positive histogram means the MACD line is above its signal line; "
            "a negative histogram means the reverse. It is most useful alongside trend and risk context."
        )
    if "moving average" in question or "ma20" in question or "ma50" in question or "ma 20" in question:
        return prefix + (
            "A moving average smooths price history over a selected number of sessions. Shorter averages react faster; longer averages show the broader trend. "
            "Price above rising averages can support an uptrend reading, but it does not guarantee a future move."
        )
    if "portfolio" in question or "diversif" in question:
        return prefix + (
            "Diversification spreads exposure across assets, sectors and regions so a single holding has less influence on the portfolio. "
            "It reduces concentration risk but cannot eliminate market-wide losses."
        )
    return prefix + (
        "Try a question about RSI, MACD, moving averages, portfolio diversification, or the signals shown for the selected ticker. "
        "The market dashboard remains available for current historical-price analysis."
    )


def fallback(question):
    return {
        "response": local_reference_response(question),
        "fallback": True,
        "timestamp": datetime.now(timezone.utc),
    }


def check_rate_limit(client):
    now = time.monotonic()
    with _lock:
        if client not in _requests and len(_requests) >= 4096:
            _requests.popitem(last=False)
        recent = _requests.setdefault(client, deque())
        while recent and recent[0] <= now - 60:
            recent.popleft()
        if len(recent) >= settings.CHAT_REQUESTS_PER_MINUTE:
            raise HTTPException(429, "Too many messages. Please wait a minute and retry.")
        recent.append(now)
        _requests.move_to_end(client)


@router.post("")
def chat(payload: ChatRequest, request: Request):
    if payload.messages[-1].role != "user" or not payload.messages[-1].content.strip():
        raise HTTPException(422, "The last message must contain a user question.")
    check_rate_limit(request.client.host if request.client else "unknown")
    question = payload.messages[-1].content
    if not settings.OPENROUTER_API_KEY:
        logger.warning("OpenRouter is not configured; serving the local chat reference response")
        return fallback(question)
    snapshot = market_snapshot(question)
    provider_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if snapshot:
        provider_messages.append({"role": "system", "content": snapshot})
    provider_messages.extend(message.model_dump() for message in payload.messages)
    try:
        response = requests.post(
            f"{settings.OPENROUTER_API_URL.rstrip('/')}/chat/completions",
            headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": settings.OPENROUTER_MODEL,
                "messages": provider_messages,
                "temperature": 0.25, "max_tokens": 800,
            },
            timeout=(10, 45),
        )
    except requests.Timeout:
        logger.warning("OpenRouter request timed out; serving the local chat reference response")
        return fallback(question)
    except requests.RequestException as exc:
        logger.warning("OpenRouter request failed (%s); serving the local chat reference response", type(exc).__name__)
        return fallback(question)
    if response.status_code == 429:
        raise HTTPException(429, "The AI provider is busy. Please retry shortly.")
    if response.status_code in (401, 402, 403):
        logger.warning("OpenRouter returned HTTP %s; serving the local chat reference response", response.status_code)
        return fallback(question)
    if not response.ok:
        logger.warning("OpenRouter returned HTTP %s; serving the local chat reference response", response.status_code)
        return fallback(question)
    try:
        content = response.json()["choices"][0]["message"]["content"]
        if not isinstance(content, str) or not content.strip():
            raise ValueError("Empty response")
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        logger.warning("OpenRouter returned an unusable response (%s); serving the local chat reference response", type(exc).__name__)
        return fallback(question)
    return {"response": content.strip(), "timestamp": datetime.now(timezone.utc)}
