"""Fetch market data once per cache window and return JSON-safe values."""
from datetime import datetime, timezone
from functools import lru_cache
import logging
import math
import time

import pandas as pd
import yfinance as yf

from app.config import settings

logger = logging.getLogger(__name__)


def finite(value):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (TypeError, ValueError):
        return None


@lru_cache(maxsize=128)
def _market_data(symbol, period, interval, cache_window):
    ticker = yf.Ticker(symbol)
    history = ticker.history(period=period, interval=interval, timeout=15)
    if history.empty:
        raise ValueError(f"No price history available for {symbol}. Check the ticker or try again later.")
    history = history.dropna(subset=["Close"])
    if history.empty:
        raise ValueError(f"No valid closing prices available for {symbol}.")
    try:
        info = ticker.info or {}
    except Exception:
        logger.warning("Company metadata unavailable for %s", symbol)
        info = {}
    return history, info


class StockService:
    @staticmethod
    def _load(symbol, period="1y", interval="1d"):
        window = int(time.monotonic() // max(settings.STOCK_DATA_CACHE_EXPIRY, 1))
        return _market_data(symbol.upper(), period, interval, window)

    @staticmethod
    def get_stock_quote(symbol, period="3mo"):
        symbol = symbol.upper()
        hist, info = StockService._load(symbol, period)
        latest = hist.iloc[-1]
        previous = finite(hist["Close"].iloc[-2]) if len(hist) > 1 else finite(info.get("previousClose"))
        current = float(latest["Close"])
        return {
            "symbol": symbol,
            "current_price": current,
            "open_price": finite(latest["Open"]) or current,
            "high_price": finite(latest["High"]) or current,
            "low_price": finite(latest["Low"]) or current,
            "volume": int(finite(latest["Volume"]) or 0),
            "market_cap": finite(info.get("marketCap")),
            "company_name": info.get("longName") or info.get("shortName") or symbol,
            "sector": info.get("sector"),
            "currency": info.get("currency"),
            "percentage_change": (current / previous - 1) * 100 if previous else None,
            "previous_close": previous,
            "historical_closes": [
                {"date": date.strftime("%Y-%m-%d"), "close": float(close)}
                for date, close in hist["Close"].items()
            ],
            "timestamp": datetime.now(timezone.utc),
        }

    @staticmethod
    def get_stock_data(symbol, period="1y", interval="1d"):
        symbol = symbol.upper()
        hist, info = StockService._load(symbol, period, interval)
        current = float(hist["Close"].iloc[-1])
        previous = float(hist["Close"].iloc[-2]) if len(hist) > 1 else current
        return {
            "symbol": symbol,
            "name": info.get("longName") or symbol,
            "currency": info.get("currency"),
            "current_price": current,
            "change": current - previous,
            "change_percent": (current / previous - 1) * 100 if previous else 0,
            "pe_ratio": finite(info.get("trailingPE")),
            "market_cap": finite(info.get("marketCap")),
            "dividend_yield": finite(info.get("dividendYield")),
            "history": [
                {"date": date.strftime("%Y-%m-%d"), "close": float(close)}
                for date, close in hist["Close"].items()
            ],
            "timestamp": datetime.now(timezone.utc),
        }

    @staticmethod
    def get_multiple_stocks(symbols):
        return [StockService.get_stock_data(symbol) for symbol in symbols]

    @staticmethod
    def calculate_technical_indicators(symbol):
        hist, _ = StockService._load(symbol)
        closes = hist["Close"]
        delta = closes.diff()
        gain = delta.clip(lower=0).rolling(14).mean().iloc[-1]
        loss = (-delta.clip(upper=0)).rolling(14).mean().iloc[-1]
        rsi = None
        if pd.notna(gain) and pd.notna(loss):
            rsi = (100 if gain > 0 else 50) if loss == 0 else 100 - 100 / (1 + gain / loss)
        macd = closes.ewm(span=12, adjust=False).mean() - closes.ewm(span=26, adjust=False).mean()
        signal = macd.ewm(span=9, adjust=False).mean()
        return {
            "symbol": symbol.upper(),
            "current_price": float(closes.iloc[-1]),
            "ma_20": finite(closes.rolling(20).mean().iloc[-1]),
            "ma_50": finite(closes.rolling(50).mean().iloc[-1]),
            "ma_200": finite(closes.rolling(200).mean().iloc[-1]),
            "rsi": finite(rsi),
            "macd": finite(macd.iloc[-1]) if len(hist) >= 26 else None,
            "macd_signal": finite(signal.iloc[-1]) if len(hist) >= 26 else None,
            "macd_histogram": finite((macd - signal).iloc[-1]) if len(hist) >= 26 else None,
            "timestamp": datetime.now(timezone.utc),
        }
