"""
Pydantic models/schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal, Annotated
from datetime import datetime

Symbol = Annotated[str, Field(min_length=1, max_length=20, pattern=r"^[A-Za-z0-9.^=-]+$")]
Period = Literal["5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "max"]


class StockSymbolRequest(BaseModel):
    """Request model for stock symbol analysis"""
    symbol: Symbol
    period: Period = "1y"
    interval: Literal["1d", "1wk", "1mo"] = "1d"


class StockDataResponse(BaseModel):
    """Response model for stock data"""
    symbol: str
    name: Optional[str] = None
    currency: Optional[str] = None
    current_price: float
    change: float
    change_percent: float
    pe_ratio: Optional[float] = None
    market_cap: Optional[float] = None
    dividend_yield: Optional[float] = None
    history: List[Dict[str, Any]] = Field(default_factory=list)
    timestamp: datetime


class StockQuoteResponse(BaseModel):
    """Response model for simple stock quote"""
    symbol: str
    current_price: float
    open_price: float
    high_price: float
    low_price: float
    volume: int
    company_name: Optional[str] = None
    currency: Optional[str] = None
    sector: Optional[str] = None
    market_cap: Optional[float] = None
    percentage_change: Optional[float] = None
    previous_close: Optional[float] = None
    historical_closes: List[Dict[str, Any]] = Field(description="Historical close prices with dates")
    timestamp: datetime


class AIAnalysisRequest(BaseModel):
    """Request model for AI stock analysis"""
    symbol: Symbol
    analysis_type: Literal["technical", "fundamental"] = "technical"
    include_forecast: bool = True


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


class ConversationMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: List[ConversationMessage] = Field(min_length=1, max_length=20)


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
