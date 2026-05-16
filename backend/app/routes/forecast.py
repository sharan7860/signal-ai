from fastapi import APIRouter, HTTPException, Query
from app.services.forecast_service import ForecastService
from typing import Optional

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.get("/{symbol}")
async def get_stock_forecast(
    symbol: str,
    days: int = Query(30, ge=1, le=90),
    p: int = 2,
    d: int = 1,
    q: int = 2
):
    """
    Get stock price forecast using ARIMA model
    """
    try:
        return ForecastService.get_arima_forecast(symbol.upper(), days, p, d, q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

 
@router.get("/{symbol}/analytics")
async def get_stock_analytics(symbol: str):
    """
    Get stock stationarity and decomposition analytics
    """
    try:
        return ForecastService.get_analytics(symbol.upper())

from app.services.stock_service import StockService

@router.get("/{symbol}/analytics")
async def get_stock_analytics(symbol: str):
    """
    Get stock stationarity, decomposition, AND deep AI-driven analytics.
    """
    try:
        # Get statistical analytics
        stats = ForecastService.get_analytics(symbol.upper())
        # Get AI-driven indicators and explanation
        ai_data = StockService.get_ai_analytics(symbol.upper())
        
        # Merge them
        return {**stats, **ai_data}
     except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
