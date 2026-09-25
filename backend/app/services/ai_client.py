"""
Ecosphere Backend — AI Service HTTP Client

Communicates with the Ecosphere AI Service over HTTP.
Handles:
- URL construction from environment settings
- Async HTTP requests via httpx
- Timeout and error handling
- Response deserialization
"""

import logging
from typing import Optional

import httpx
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Loaded at runtime via settings — see config/settings.py
_AI_SERVICE_URL: Optional[str] = None


def _get_ai_service_url() -> str:
    """Lazy-load the AI service URL from settings."""
    global _AI_SERVICE_URL
    if _AI_SERVICE_URL is None:
        from app.config.settings import settings
        _AI_SERVICE_URL = settings.ai_service_url
    return _AI_SERVICE_URL


async def get_economic_data(iso3: str) -> dict:
    """
    Request economic data from the AI Service for a given ISO3 country code.

    Args:
        iso3: ISO 3166-1 alpha-3 country code (e.g. "IND")

    Returns:
        Parsed JSON response dict from the AI Service.

    Raises:
        HTTPException 503 if AI Service is unreachable.
        HTTPException 400/500 proxied from AI Service errors.
    """
    url = f"{_get_ai_service_url()}/api/economic/{iso3}"
    logger.info("Fetching economic data from AI Service: %s", url)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(url)

        # Proxy AI Service error responses
        if response.status_code != 200:
            try:
                detail = response.json().get("detail", response.text[:300])
            except Exception:
                detail = response.text[:300]

            logger.warning(
                "AI Service returned %d for %s: %s",
                response.status_code,
                iso3,
                detail,
            )
            raise HTTPException(
                status_code=response.status_code,
                detail=f"AI Service error: {detail}",
            )

        return response.json()

    except HTTPException:
        raise
    except httpx.TimeoutException:
        logger.error("AI Service timeout for %s", iso3)
        raise HTTPException(
            status_code=503,
            detail="AI Service request timed out. The World Bank API may be slow.",
        )
    except (httpx.ConnectError, httpx.NetworkError) as exc:
        logger.error("Cannot connect to AI Service for %s: %s", iso3, exc)
        raise HTTPException(
            status_code=503,
            detail=f"AI Service is unreachable at {_get_ai_service_url()}. Is it running?",
        )
    except Exception as exc:
        logger.exception("Unexpected error calling AI Service for %s: %s", iso3, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error communicating with AI Service: {exc}",
        )


async def get_historical_economic_data(iso3: str) -> dict:
    """
    Request historical economic data from the AI Service for a given ISO3 country code.

    Args:
        iso3: ISO 3166-1 alpha-3 country code (e.g. "IND")

    Returns:
        Parsed HistoricalEconomicData response dict from the AI Service.
    """
    url = f"{_get_ai_service_url()}/api/historical/{iso3}"
    logger.info("Fetching historical economic data from AI Service: %s", url)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(url)

        if response.status_code != 200:
            try:
                detail = response.json().get("detail", response.text[:300])
            except Exception:
                detail = response.text[:300]

            logger.warning(
                "AI Service historical returned %d for %s: %s",
                response.status_code,
                iso3,
                detail,
            )
            raise HTTPException(
                status_code=response.status_code,
                detail=f"AI Service error: {detail}",
            )

        return response.json()

    except HTTPException:
        raise
    except httpx.TimeoutException:
        logger.error("AI Service historical timeout for %s", iso3)
        raise HTTPException(
            status_code=503,
            detail="AI Service historical request timed out.",
        )
    except (httpx.ConnectError, httpx.NetworkError) as exc:
        logger.error("Cannot connect to AI Service for %s: %s", iso3, exc)
        raise HTTPException(
            status_code=503,
            detail=f"AI Service is unreachable at {_get_ai_service_url()}. Is it running?",
        )
    except Exception as exc:
        logger.exception("Unexpected error calling AI Service historical for %s: %s", iso3, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error communicating with AI Service: {exc}",
        )

