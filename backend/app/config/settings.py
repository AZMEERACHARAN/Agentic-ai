"""
Ecosphere Backend — Application Settings
Loads configuration from environment variables using pydantic-settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # --- Supabase ---
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # --- AI Service ---
    ai_service_url: str = "http://localhost:8001"

    # --- App ---
    app_name: str = "Ecosphere Backend"
    app_version: str = "0.1.0"
    debug: bool = False


# Singleton settings instance
settings = Settings()
