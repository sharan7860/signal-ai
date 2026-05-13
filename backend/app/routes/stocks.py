"""
Stock analysis endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models import StockSymbolRequest, StockDataResponse, StockQuoteResponse, AIAnalysisRequest, AIAnalysisResponse
from app.services import StockService, AIAnalysisService
from datetime import datetime
from typing import List

router = APIRouter(tags=["Stocks"])


@router.get("/stock/{symbol}", response_model=StockQuoteResponse, tags=["Stock Quote"])
async def get_stock_quote(symbol: str):
    """
    Get stock quote with current price and historical close prices

    Returns:
    - symbol: Stock ticker symbol
    - current_price: Latest closing price
    - open_price: Day's opening price
    - high_price: Day's high price
    - low_price: Day's low price
    - volume: Trading volume
    - market_cap: Market capitalization
    - company_name: Company name
    - sector: Sector
    - currency: Currency
    - percentage_change: Percentage change
    - previous_close: Previous close price
    - historical_closes: Last 3 months of daily close prices
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
async def get_stock_data(request: StockSymbolRequest):
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
async def get_stock_by_symbol(symbol: str):
    """
    Get stock data by symbol
    """
    try:
        data = StockService.get_stock_data(symbol=symbol)
        return StockDataResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching stock data: {str(e)}")


@router.post("/api/stocks/analyze", response_model=AIAnalysisResponse)
async def analyze_stock(request: AIAnalysisRequest):
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
async def compare_stocks(symbols: str):
    """
    Compare multiple stocks
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        stocks = StockService.get_multiple_stocks(symbol_list)
        return {"stocks": stocks, "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error comparing stocks: {str(e)}")
