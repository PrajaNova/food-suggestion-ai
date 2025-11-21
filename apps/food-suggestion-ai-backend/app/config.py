from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    openai_api_key: str = ""
    gemini_api_key: str = ""
    
    # AI Provider Selection
    ai_provider: str = "openai"  # "openai" or "gemini"
    
    # Model Configuration
    openai_model: str = "gpt-4o-mini"
    gemini_model: str = "models/gemini-2.0-flash-lite"
    
    # Application Settings
    app_name: str = "Food Suggestion AI"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
