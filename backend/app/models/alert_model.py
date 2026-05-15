from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Literal

class Alert(BaseModel):
    id: str
    type: Literal["RSI", "MACD", "Sentiment", "Portfolio", "Risk", "Market", "Recommendation", "Prediction"]
    symbol: str
    severity: Literal["success", "warning", "danger", "info"]
    title: str
    message: str
    timestamp: datetime
    read: bool = False
    priority: int = Field(default=1, ge=1, le=5)

class AlertResponse(BaseModel):
    alerts: List[Alert]
    unread_count: int
    timestamp: datetime
