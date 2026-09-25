"""
Ecosphere AI Service — Application Settings
Loads configuration from environment variables using pydantic-settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """AI Service settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # --- Google Gemini ---
    gemini_api_key: str = ""

    # --- Supabase (documented for future use) ---
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # --- App ---
    app_name: str = "Ecosphere AI Service"
    app_version: str = "0.1.0"
    debug: bool = False

    # --- Gemini Model ---
    gemini_model: str = "gemini-2.0-flash"


# Singleton settings instance
settings = Settings()
