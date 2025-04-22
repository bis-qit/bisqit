import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings managed through environment variables."""

    # API Settings
    APP_NAME: str = "BisQit Quantum Circuit Simulator API"
    API_VERSION: str = "1.0.0"

    # CORS Settings
    # In production, replace with specific origins
    CORS_ORIGINS: List[str] = ["*"]

    # Simulation Settings
    DEFAULT_SHOTS: int = 1024

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create settings instance
settings = Settings()
