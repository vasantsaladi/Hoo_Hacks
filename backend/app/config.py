"""
Configuration settings for the food waste prediction API
"""
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """
    Application settings
    """
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Food Waste Predictor API"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # HuggingFace settings
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    HF_MODEL_ID: str = os.getenv("HF_MODEL_ID", "default-model-id")
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()
