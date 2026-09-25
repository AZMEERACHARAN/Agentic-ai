"""
Ecosphere AI Service — Gemini Client
Provides a reusable, lazily-initialized Google Gemini client using the
current google-genai SDK (replaces the deprecated google-generativeai package).
"""

from typing import Optional

from config.settings import settings

_gemini_configured: bool = False
_gemini_client = None  # google.genai.Client instance


def configure_gemini() -> bool:
    """
    Configure the Google Gemini SDK with the API key from settings.

    Returns:
        True if configuration succeeded, False if the API key is not set.
    """
    global _gemini_configured, _gemini_client

    if _gemini_configured:
        return True

    if not settings.gemini_api_key:
        return False

    try:
        from google import genai  # type: ignore

        _gemini_client = genai.Client(api_key=settings.gemini_api_key)
        _gemini_configured = True
        return True
    except Exception:
        return False


def get_gemini_client():
    """
    Returns a configured google.genai.Client instance.

    Raises:
        RuntimeError: If Gemini is not configured (missing API key).
    """
    if not configure_gemini():
        raise RuntimeError(
            "Gemini API key is not configured. "
            "Please set GEMINI_API_KEY in your .env file."
        )
    return _gemini_client


def is_gemini_configured() -> bool:
    """Returns True if the Gemini SDK has been configured with a valid API key."""
    return bool(settings.gemini_api_key)
