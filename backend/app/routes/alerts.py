from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from app.services.alert_service import AlertService
from app.models.alert_model import Alert, AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/", response_model=AlertResponse)
async def get_alerts(symbol: Optional[str] = None):
    """
    Get live AI alerts. Supports filtering by symbol.
    """
    try:
        alerts = await AlertService.get_all_alerts(symbol)
        unread_count = len([a for a in alerts if not a.read])
        
        return {
            "alerts": alerts,
            "unread_count": unread_count,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    """
    Mark a specific alert as read.
    """
    AlertService.mark_as_read(alert_id)
    return {"status": "success"}

@router.post("/read-all")
async def mark_all_read():
    """
    Mark all alerts as read.
    """
    AlertService.mark_all_as_read()
    return {"status": "success"}
