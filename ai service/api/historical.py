"""
Ecosphere AI Service — Historical Economic Data API Router

Exposes GET /api/historical/{iso3}

Invokes the Historical Data Agent (LangGraph) with Supabase cache-first orchestration.
Returns verified historical economic time-series data from World Bank / Supabase cache.
"""

import logging
from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import JSONResponse

from agents.historical.graph import run_historical_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/historical/{iso3}",
    summary="Get historical economic data for a country",
    description=(
        "Invokes the Historical Data Agent to retrieve approximately 10 years "
        "of verified economic indicators using a Supabase cache-first workflow. "
        "Data is sourced from World Bank Open Data."
    ),
)
async def get_historical_data(
    iso3: str = Path(
        ...,
        min_length=3,
        max_length=3,
        description="ISO 3166-1 alpha-3 country code (e.g. IND, USA, CHN)",
        example="IND",
    ),
) -> JSONResponse:
    """
    Run the Historical Data Agent for the given ISO3 code.
    - Validates ISO3 code.
    - Checks Supabase cache for existing observations.
    - Retrieves any missing years/indicators from World Bank.
    - Upserts new observations into Supabase.
    - Returns structured HistoricalEconomicData JSON.
    """
    iso3_upper = iso3.strip().upper()
    logger.info("Historical economic data request received for: %s", iso3_upper)

    try:
        final_state = await run_historical_agent(iso3_upper)
    except Exception as exc:
        logger.exception("Historical agent failed for %s: %s", iso3_upper, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Historical Data Agent internal error: {exc}",
        ) from exc

    fatal_error = final_state.get("fatal_error")
    if fatal_error:
        raise HTTPException(status_code=400, detail=fatal_error)

    historical_data = final_state.get("historical_data")
    if not historical_data:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Historical Data Agent completed for {iso3_upper} but produced no data. "
                f"Errors: {final_state.get('errors', [])}"
            ),
        )

    logger.info(
        "Historical data returned for %s (source: %s, indicators: %d)",
        iso3_upper,
        historical_data.get("data_source"),
        len(historical_data.get("indicators", {})),
    )

    return JSONResponse(content=historical_data)
