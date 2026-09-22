"""
Logging utilities
"""
import logging
import sys
import json
from app.config import settings

def setup_logging():
    """Configure logging for the application"""
    handler = logging.StreamHandler(sys.stdout)
    if settings.LOG_FORMAT == "json":
        class JsonFormatter(logging.Formatter):
            def format(self, record):
                return json.dumps({"level": record.levelname, "message": record.getMessage()})
        handler.setFormatter(JsonFormatter())
    else:
        handler.setFormatter(logging.Formatter(settings.LOG_FORMAT))
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        handlers=[handler],
    )
    return logging.getLogger(__name__)
