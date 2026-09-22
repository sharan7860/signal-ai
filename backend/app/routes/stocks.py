"""Synchronous market calls run in FastAPI's worker thread pool."""
from datetime import datetime, timezone
import logging
import re
from typing import Annotated

from fastapi import APIRouter, HTTPException, Path
from app.config import settings
from app.models import StockSymbolRequest, StockDataResponse, StockQuoteResponse, AIAnalysisRequest, AIAnalysisResponse
from app.models.schemas import Period
from app.services import StockService, AIAnalysisService

router = APIRouter(tags=["Stocks"])
logger = logging.getLogger(__name__)
Symbol = Annotated[str, Path(min_length=1, max_length=20, pattern=r"^[A-Za-z0-9.^=-]+$")]


def market_call(operation):
    try:
        return operation()
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Market provider request failed")
        raise HTTPException(status_code=502, detail="Market data is temporarily unavailable. Please try again.") from exc


@router.get("/stock/{symbol}", response_model=StockQuoteResponse)
@router.get("/api/stocks/quote/{symbol}", response_model=StockQuoteResponse)
def get_stock_quote(symbol: Symbol, period: Period = "3mo"):
    return market_call(lambda: StockService.get_stock_quote(symbol.upper(), period))


@router.post("/api/stocks/data", response_model=StockDataResponse)
def get_stock_data(request: StockSymbolRequest):
    return market_call(lambda: StockService.get_stock_data(request.symbol, request.period, request.interval))


@router.get("/api/stocks/data/{symbol}", response_model=StockDataResponse)
def get_stock_by_symbol(symbol: Symbol):
    return market_call(lambda: StockService.get_stock_data(symbol))


def analyze(request):
    if request.analysis_type == "fundamental":
        result = AIAnalysisService.analyze_fundamental(request.symbol, StockService.get_stock_data(request.symbol))
    else:
        result = AIAnalysisService.analyze_technical(request.symbol, StockService.calculate_technical_indicators(request.symbol))
    if request.include_forecast:
        result["forecast"] = AIAnalysisService.generate_forecast(request.symbol, StockService.get_stock_data(request.symbol))
    return result


@router.post("/api/stocks/analyze", response_model=AIAnalysisResponse)
def analyze_stock(request: AIAnalysisRequest):
    return market_call(lambda: analyze(request))


@router.get("/api/stocks/dashboard/{symbol}")
def dashboard(symbol: Symbol):
    def load():
        quote = StockService.get_stock_quote(symbol, "1y")
        indicators = StockService.calculate_technical_indicators(symbol)
        result = AIAnalysisService.analyze_technical(symbol, indicators)
        result["forecast"] = AIAnalysisService.generate_forecast(symbol, StockService.get_stock_data(symbol))
        return {"quote": quote, "indicators": indicators, "analysis": result}
    return market_call(load)


@router.get("/api/stocks/compare/{symbols}")
def compare_stocks(symbols: str):
    items = list(dict.fromkeys(s.strip().upper() for s in symbols.split(",")))
    if len(items) > settings.MAX_STOCKS_PER_REQUEST or any(not re.fullmatch(r"[A-Z0-9.^=-]{1,20}", s) for s in items):
        raise HTTPException(status_code=422, detail="Provide valid tickers within the configured stock limit.")
    return market_call(lambda: {"stocks": StockService.get_multiple_stocks(items), "timestamp": datetime.now(timezone.utc)})
