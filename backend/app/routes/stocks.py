"""
Stock analysis endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models import StockSymbolRequest, StockDataResponse, StockQuoteResponse, AIAnalysisRequest, AIAnalysisResponse
from app.services import StockService, AIAnalysisService
from datetime import datetime
import logging
from typing import List

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Stocks"])


@router.get("/stock/{symbol}", response_model=StockQuoteResponse, tags=["Stock Quote"])
def get_stock_quote(symbol: str):
    """
    Get stock quote with current price and historical close prices
    """
    try:
        if not symbol or len(symbol) > 10:
            raise ValueError("Invalid symbol format")

        data = StockService.get_stock_quote(symbol.upper(), period="3mo")
        return StockQuoteResponse(**data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid symbol: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock quote: {str(e)}")


# Legacy API endpoints with /api/stocks prefix
@router.post("/api/stocks/data", response_model=StockDataResponse)
def get_stock_data(request: StockSymbolRequest):
    """
    Get stock data for a given symbol
    """
    try:
        data = StockService.get_stock_data(
            symbol=request.symbol,
            period=request.period,
            interval=request.interval,
        )
        return StockDataResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching stock data: {str(e)}")


@router.get("/api/stocks/data/{symbol}", response_model=StockDataResponse)
def get_stock_by_symbol(symbol: str):
    """
    Get stock data by symbol
    """
    try:
        data = StockService.get_stock_data(symbol=symbol)
        return StockDataResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching stock data: {str(e)}")


@router.post("/api/stocks/analyze", response_model=AIAnalysisResponse)
def analyze_stock(request: AIAnalysisRequest):
    """
    Get AI analysis for a stock
    """
    try:
        # Get technical indicators
        indicators = StockService.calculate_technical_indicators(request.symbol)

        # Perform analysis based on type
        if request.analysis_type == "technical":
            result = AIAnalysisService.analyze_technical(request.symbol, indicators)
        elif request.analysis_type == "fundamental":
            stock_data = StockService.get_stock_data(request.symbol)
            result = AIAnalysisService.analyze_fundamental(request.symbol, stock_data)
        else:
            result = AIAnalysisService.analyze_technical(request.symbol, indicators)

        # Generate forecast if requested
        if request.include_forecast:
            stock_data = StockService.get_stock_data(request.symbol)
            forecast = AIAnalysisService.generate_forecast(request.symbol, stock_data)
            result["forecast"] = forecast

        return AIAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing stock: {str(e)}")


@router.get("/api/stocks/compare/{symbols}")
def compare_stocks(symbols: str):
    """
    Compare multiple stocks
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        stocks = StockService.get_multiple_stocks(symbol_list)
        return {"stocks": stocks, "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error comparing stocks: {str(e)}")
@router.get("/api/stocks/info/{symbols}")
def get_stocks_info(symbols: str):
    """
    Get info for multiple stocks (sector, industry, name)
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        info_list = [StockService.get_stock_info(s) for s in symbol_list]
        return {"info": info_list, "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching stock info: {str(e)}")


@router.get("/api/stocks/news/{symbols}")
def get_stocks_news(symbols: str):
    """
    Get live news for multiple stocks from the watchlist
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
<<<<<<< HEAD
        all_news = []
        for sym in symbol_list:
            if not sym: continue
            all_news.extend(StockService.get_stock_news(sym))
=======
        news_map = {}
        for sym in symbol_list:
            if not sym: continue
            ticker_news = StockService.get_stock_news(sym)
            for item in ticker_news:
                if item["id"] not in news_map:
                    news_map[item["id"]] = item
        
        all_news = list(news_map.values())
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
        
        # Sort by publish time descending
        all_news.sort(key=lambda x: x.get("provider_publish_time") or 0, reverse=True)
        
<<<<<<< HEAD
        return {"news": all_news[:20], "default_watchlist": ["AAPL", "NVDA", "TSLA", "MSFT", "GOOGL"], "timestamp": datetime.utcnow()}
    except Exception as e:
        logger.error(f"News fetch error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching stock news: {str(e)}")
=======
        return {"news": all_news[:20], "timestamp": datetime.utcnow()}
    except Exception as e:
        logger.error(f"News fetch error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching stock news: {str(e)}")


@router.get("/api/analytics/{symbol}")
def get_stock_analytics(symbol: str):
    """
    Get deep AI-driven analytics for a specific stock
    """
    try:
        data = StockService.get_ai_analytics(symbol)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching analytics: {str(e)}")
@router.get("/portfolio/analytics")
def get_portfolio_analytics(symbols: str = ""):
    """
    Get aggregate AI portfolio analytics for the provided symbols.
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        data = StockService.get_portfolio_analytics(symbol_list)
        return data
    except Exception as e:
        logger.error(f"Portfolio analytics route error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error fetching portfolio analytics: {str(e)}")
@router.get("/api/stocks/trending")
def get_trending_stocks():
    """
    Get stocks currently trending in the news or high-activity tickers
    """
    try:
        symbols = StockService.get_trending_symbols()
        stocks = StockService.get_multiple_stocks(symbols)
        return {"stocks": stocks, "timestamp": datetime.utcnow()}
    except Exception as e:
        logger.error(f"Trending stocks route error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error fetching trending stocks: {str(e)}")
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
