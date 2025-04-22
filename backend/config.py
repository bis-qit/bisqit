import os
from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings managed through environment variables."""

    # API Settings
    APP_NAME: str = "BisQit Quantum Circuit Simulator API"
    API_VERSION: str = "1.0.0"

    # CORS Settings
    CORS_ORIGINS: List[str] = ["*"]

    # Simulation Settings
    DEFAULT_SHOTS: int = 1024

    # Database settings - no defaults for security reasons
    MYSQL_SERVER: Optional[str] = None
    MYSQL_USER: Optional[str] = None
    MYSQL_PASSWORD: Optional[str] = None
    MYSQL_DB: Optional[str] = None
    MYSQL_PORT: Optional[int] = None

    # Security settings - no defaults for security reasons
    SECRET_KEY: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # Additional settings
    BACKEND_CORS_ORIGINS: Optional[str] = None
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Allow extra fields to avoid validation errors
        extra = "ignore"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse BACKEND_CORS_ORIGINS string to list if available
        if self.BACKEND_CORS_ORIGINS:
            try:
                import json
                self.CORS_ORIGINS = json.loads(self.BACKEND_CORS_ORIGINS)
            except Exception:
                # If parsing fails, keep the default
                pass

        # Validate that required settings are available
        self.validate_required_settings()
    
    def validate_required_settings(self):
        """Validate that required settings are available."""
        required_settings = []
        
        # Only check database settings if in production mode
        if not self.DEBUG:
            required_settings.extend([
                "MYSQL_SERVER", 
                "MYSQL_USER", 
                "MYSQL_PASSWORD", 
                "MYSQL_DB"
            ])
        
        # Security settings are always required
        required_settings.append("SECRET_KEY")
        
        missing = [setting for setting in required_settings 
                  if getattr(self, setting) is None]
        
        if missing:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing)}. "
                f"Please check your .env file or environment variables."
            )


# Create settings instance
settings = Settings()
