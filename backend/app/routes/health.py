"""
Health check and root endpoints
"""
from fastapi import APIRouter
from app.config import settings
from app.models import HealthResponse
from datetime import datetime

router = APIRouter(tags=["Health"])


@router.get("/", response_model=HealthResponse)
async def root():
    """
    Root endpoint - health check
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=settings.APP_VERSION,
    )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=settings.APP_VERSION,
    )
