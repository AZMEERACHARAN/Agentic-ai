"""
Ecosphere AI Service — Supabase Client Singleton

Provides a lazily-initialized Supabase client instance.
"""

import logging
from typing import Optional
from supabase import Client, create_client
from config.settings import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Returns a singleton Supabase client instance.
    Returns None if Supabase credentials are not configured.
    """
    global _supabase_client

    if _supabase_client is None:
        url = settings.supabase_url.strip()
        key = settings.supabase_service_role_key.strip()

        if not url or not key:
            logger.warning("Supabase URL or Service Role Key is not configured in AI Service.")
            return None

        try:
            _supabase_client = create_client(url, key)
            logger.info("Supabase client initialized successfully in AI Service.")
        except Exception as exc:
            logger.error("Failed to initialize Supabase client in AI Service: %s", exc)
            return None

    return _supabase_client
