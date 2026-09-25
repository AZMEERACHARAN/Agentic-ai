"""
Ecosphere AI Service — Economic Data API Router

Exposes GET /api/economic/{iso3}

Invokes the Economic Data Agent (LangGraph) and returns structured EconomicData.
Economic values come exclusively from World Bank Open Data API — not from Gemini.
"""

import logging
from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import JSONResponse

from agents.economic.graph import run_economic_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/economic/{iso3}",
    summary="Get economic data for a country",
    description=(
        "Invokes the Economic Data Agent to retrieve verified economic indicators "
        "from World Bank Open Data. Returns structured JSON with GDP, growth, "
        "per-capita, inflation, unemployment, population, and FDI."
    ),
)
async def get_economic_data(
    iso3: str = Path(
        ...,
        min_length=3,
        max_length=3,
        description="ISO 3166-1 alpha-3 country code (e.g. IND, USA, CHN)",
        example="IND",
    ),
) -> JSONResponse:
    """
    Run the Economic Data Agent for the given ISO3 country code.

    - Validates ISO3 format.
    - Calls World Bank Open Data API via LangGraph agent.
    - Returns structured EconomicData JSON.
    - 422 on format errors, 400 on invalid ISO3, 500 on agent failure.
    """
    iso3_upper = iso3.strip().upper()
    logger.info("Economic data request received: %s", iso3_upper)

    try:
        final_state = await run_economic_agent(iso3_upper)
    except Exception as exc:
        logger.exception("Economic agent crashed for %s: %s", iso3_upper, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Economic Data Agent internal error: {exc}",
        ) from exc

    # Hard validation failure (e.g. malformed ISO3)
    fatal_error = final_state.get("fatal_error")
    if fatal_error:
        raise HTTPException(status_code=400, detail=fatal_error)

    # Agent ran but produced no data
    economic_data = final_state.get("economic_data")
    if not economic_data:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Economic Data Agent completed for {iso3_upper} but returned no data. "
                f"Errors: {final_state.get('errors', [])}"
            ),
        )

    logger.info(
        "Economic data returned for %s: %d missing indicators",
        iso3_upper,
        len(final_state.get("missing_indicators", [])),
    )

    return JSONResponse(content=economic_data)
