"""
Pydantic models/schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class StockSymbolRequest(BaseModel):
    """Request model for stock symbol analysis"""
    symbol: str = Field(..., description="Stock ticker symbol (e.g., AAPL)")
    period: Optional[str] = Field("1y", description="Data period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, 10y, max)")
    interval: Optional[str] = Field("1d", description="Data interval (1m, 5m, 15m, 30m, 60m, 1d, 1wk, 1mo)")


class StockDataResponse(BaseModel):
    """Response model for stock data"""
    symbol: str
    name: Optional[str] = None
    current_price: float
    change: float
    change_percent: float
    pe_ratio: Optional[float] = None
    market_cap: Optional[Any] = None
    dividend_yield: Optional[float] = None
    timestamp: datetime


class StockQuoteResponse(BaseModel):
    """Response model for simple stock quote"""
    symbol: str
    current_price: float
    open_price: float
    high_price: float
    low_price: float
    volume: int
    historical_closes: List[Dict[str, Any]] = Field(description="Historical close prices with dates")
    timestamp: datetime
    company_name: Optional[str] = None
    percentage_change: Optional[float] = 0.0


class AIAnalysisRequest(BaseModel):
    """Request model for AI stock analysis"""
    symbol: str = Field(..., description="Stock ticker symbol")
    analysis_type: Optional[str] = Field("technical", description="Type of analysis (technical, fundamental, sentiment)")
    include_forecast: Optional[bool] = Field(True, description="Include price forecast")


class AIAnalysisResponse(BaseModel):
    """Response model for AI analysis"""
    symbol: str
    analysis_type: str
    summary: str
    sentiment: str
    recommendation: str  # buy, sell, hold
    confidence_score: float
    forecast: Optional[Dict[str, Any]] = None
    timestamp: datetime


class PortfolioAnalysisRequest(BaseModel):
    """Request model for portfolio analysis"""
    symbols: List[str] = Field(..., description="List of stock symbols")
    weights: Optional[List[float]] = Field(None, description="Portfolio weights (optional)")


class PortfolioAnalysisResponse(BaseModel):
    """Response model for portfolio analysis"""
    total_value: float
    diversification_score: float
    risk_level: str
    recommended_allocation: Dict[str, float]
    top_performers: List[Dict[str, Any]]
    underperformers: List[Dict[str, Any]]
    timestamp: datetime


class ChatMessageRequest(BaseModel):
    """Request model for chat messages"""
    message: str = Field(..., description="User message")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class ChatMessageResponse(BaseModel):
    """Response model for chat messages"""
    response: str
    timestamp: datetime
    confidence: float


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    timestamp: datetime
    version: str
