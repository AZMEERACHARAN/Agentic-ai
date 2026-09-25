"""
Ecosphere Backend — Economy API Router

Exposes GET /api/economy/{iso3}

Acts as the proxy gateway between the frontend and the AI Service.
Does not perform any data retrieval itself — delegates to the AI Service.
"""

import logging
from fastapi import APIRouter, Path
from fastapi.responses import JSONResponse

from app.services.ai_client import get_economic_data, get_historical_economic_data

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/economy/{iso3}/historical",
    summary="Get historical economic data for a country",
    description=(
        "Fetches 10-year historical economic time-series data from the Ecosphere "
        "AI Service for the given ISO3 country code."
    ),
)
async def economy_historical_endpoint(
    iso3: str = Path(
        ...,
        min_length=3,
        max_length=3,
        description="ISO 3166-1 alpha-3 country code",
        example="IND",
    ),
) -> JSONResponse:
    """
    Proxy endpoint: delegates to AI Service historical data agent.
    Returns structured HistoricalEconomicData JSON.
    """
    iso3_upper = iso3.strip().upper()
    logger.info("Economy historical request received for %s", iso3_upper)

    data = await get_historical_economic_data(iso3_upper)
    return JSONResponse(content=data)


@router.get(
    "/economy/{iso3}",
    summary="Get economic data for a country",
    description=(
        "Fetches economic data from the Ecosphere AI Service for the given "
        "ISO3 country code. Data is sourced from the World Bank Open Data API."
    ),
)
async def economy_endpoint(
    iso3: str = Path(
        ...,
        min_length=3,
        max_length=3,
        description="ISO 3166-1 alpha-3 country code",
        example="IND",
    ),
) -> JSONResponse:
    """
    Proxy endpoint: delegates to AI Service economic data agent.
    Returns structured EconomicData JSON.
    """
    iso3_upper = iso3.strip().upper()
    logger.info("Economy request received for %s", iso3_upper)

    data = await get_economic_data(iso3_upper)
    return JSONResponse(content=data)
