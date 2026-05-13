"""
Logging utilities
"""
import logging
import sys
from app.config import settings

def setup_logging():
    """Configure logging for the application"""
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=settings.LOG_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )
    return logging.getLogger(__name__)
