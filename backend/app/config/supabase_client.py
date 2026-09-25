"""
Ecosphere Backend — Supabase Client
Provides a reusable, lazily-initialized Supabase client.
"""

from typing import Optional

from supabase import Client, create_client

from app.config.settings import settings

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Returns a singleton Supabase client instance.

    The client is initialized on first call using the configured
    SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.

    Raises:
        ValueError: If Supabase URL or service role key is not configured.
    """
    global _supabase_client

    if _supabase_client is None:
        if not settings.supabase_url:
            raise ValueError(
                "SUPABASE_URL is not configured. "
                "Please set it in your .env file."
            )
        if not settings.supabase_service_role_key:
            raise ValueError(
                "SUPABASE_SERVICE_ROLE_KEY is not configured. "
                "Please set it in your .env file."
            )

        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )

    return _supabase_client
