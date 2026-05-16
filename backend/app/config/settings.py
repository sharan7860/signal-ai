"""
Configuration settings for the AI Stock Backend
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # API Configuration
    APP_NAME: str = "AI Stock Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Server Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    RELOAD: bool = True

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:8080", 
        "http://localhost:8081", 
        "http://localhost:3000", 
        "http://127.0.0.1:8080",
<<<<<<< HEAD
        "http://127.0.0.1:8081"
=======
        "http://127.0.0.1:8081",
        "https://stellar-signal-ai.vercel.app",
        "https://stellar-signal-ai.web.app",
        "https://stellar-signal-ai.firebaseapp.com"
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]


    # OpenRouter API Configuration (for AI responses)
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_API_URL: str = "https://openrouter.ai/api/v1"

    # Stock Data Configuration
    STOCK_DATA_CACHE_EXPIRY: int = 3600  # 1 hour in seconds
    MAX_STOCKS_PER_REQUEST: int = 50
    DEFAULT_STOCK_INTERVAL: str = "1d"  # daily data

    # AI Model Configuration
    ML_MODEL_PATH: str = "./models"
    USE_GPU: bool = True
    MODEL_BATCH_SIZE: int = 32

    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Instantiate settings
settings = Settings()
