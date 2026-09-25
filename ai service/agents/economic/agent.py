"""
Ecosphere AI Service — Economic Data Agent: Graph Nodes

Each function here is a LangGraph node in the Economic Data Agent workflow.

Node sequence:
  validate_country
      ↓
  determine_indicators
      ↓
  retrieve_data          (calls World Bank tool concurrently)
      ↓
  validate_data
      ↓
  normalize_data
      ↓
  END
"""

import logging
import re
from datetime import datetime, timezone
from typing import Any

from agents.economic.state import EconomicAgentState
from tools.worldbank.client import fetch_all_indicators
from tools.worldbank.indicators import (
    ALL_INDICATORS,
    INDICATOR_METADATA,
    WORLD_BANK_CODES,
)
from schemas.economic import (
    EconomicData,
    EconomicIndicator,
    EconomicIndicators,
)

logger = logging.getLogger(__name__)

# ISO 3166-1 alpha-3: exactly 3 uppercase letters
_ISO3_PATTERN = re.compile(r"^[A-Z]{3}$")


# ─────────────────────────────────────────────────────────────────────────────
# Node 1: Validate Country
# ─────────────────────────────────────────────────────────────────────────────

def validate_country(state: EconomicAgentState) -> EconomicAgentState:
    """
    Validate the ISO3 country code.
    - Must be exactly 3 uppercase letters.
    - Does not call World Bank here; format check only.
    - On failure: sets fatal_error and validation_passed=False.
    """
    code = (state.get("country_code") or "").strip().upper()

    if not _ISO3_PATTERN.match(code):
        logger.warning("Invalid ISO3 code rejected: '%s'", code)
        return {
            **state,
            "country_code": code,
            "validation_passed": False,
            "country_name": "",
            "fatal_error": (
                f"Invalid ISO3 country code: '{state.get('country_code', '')}'. "
                "Must be exactly 3 uppercase letters (e.g. IND, USA, CHN)."
            ),
        }

    logger.info("ISO3 validation passed: %s", code)
    return {
        **state,
        "country_code": code,
        "validation_passed": True,
        "country_name": code,  # Will be overwritten by real name from API response
        "fatal_error": None,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 2: Determine Indicators
# ─────────────────────────────────────────────────────────────────────────────

def determine_indicators(state: EconomicAgentState) -> EconomicAgentState:
    """
    Determine which indicators to retrieve.
    Currently retrieves all configured indicators.
    Could be extended to accept a subset in the request.
    """
    indicators = ALL_INDICATORS
    logger.info(
        "Determined %d indicators to retrieve for %s: %s",
        len(indicators),
        state["country_code"],
        indicators,
    )
    return {
        **state,
        "requested_indicators": indicators,
        "raw_data": {},
        "missing_indicators": [],
        "errors": state.get("errors", []),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 3: Retrieve Data (calls World Bank tool)
# ─────────────────────────────────────────────────────────────────────────────

async def retrieve_data(state: EconomicAgentState) -> EconomicAgentState:
    """
    Retrieve all requested indicators concurrently via the World Bank tool.
    Stores raw results per indicator key.
    Non-fatal errors are recorded per-indicator.
    """
    iso3 = state["country_code"]
    indicator_keys = state["requested_indicators"]

    logger.info("Fetching %d indicators from World Bank for %s", len(indicator_keys), iso3)

    results = await fetch_all_indicators(iso3=iso3, indicator_keys=indicator_keys)

    raw_data: dict[str, Any] = {}
    errors: list[str] = list(state.get("errors", []))
    country_name: str = state.get("country_name", iso3)

    for result in results:
        raw_data[result.indicator_key] = result.model_dump()

        if result.error:
            error_msg = f"{result.indicator_key}: {result.error}"
            errors.append(error_msg)
            logger.warning("World Bank retrieval error — %s", error_msg)
        else:
            logger.debug(
                "Retrieved %s for %s: value=%s year=%s",
                result.indicator_key,
                iso3,
                result.value,
                result.year,
            )

    return {
        **state,
        "raw_data": raw_data,
        "errors": errors,
        "country_name": country_name,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 4: Validate Data
# ─────────────────────────────────────────────────────────────────────────────

def validate_data(state: EconomicAgentState) -> EconomicAgentState:
    """
    Validate the raw data received from World Bank.
    Identifies:
    - Which indicators have valid numeric values
    - Which indicators have null values (unavailable, not an error)
    - Which indicators have retrieval errors
    """
    raw_data = state.get("raw_data", {})
    missing_indicators: list[str] = []
    errors: list[str] = list(state.get("errors", []))

    # Detect country name from any successful result
    country_name: str = state.get("country_name", state["country_code"])

    for key in state.get("requested_indicators", []):
        result = raw_data.get(key, {})

        if not result:
            missing_indicators.append(key)
            continue

        value = result.get("value")
        year = result.get("year")

        # Value is None — data unavailable (not an error for non-critical indicators)
        if value is None:
            missing_indicators.append(key)
            if result.get("error"):
                errors.append(f"{key}: retrieval failed — {result['error']}")
            continue

        # Validate numeric type
        if not isinstance(value, (int, float)):
            missing_indicators.append(key)
            errors.append(f"{key}: value is not numeric — {type(value).__name__}")
            continue

        # Validate year
        if year is not None and not (1960 <= year <= 2030):
            errors.append(f"{key}: year out of expected range — {year}")

    logger.info(
        "Data validation complete for %s: %d/%d indicators available, %d missing",
        state["country_code"],
        len(state.get("requested_indicators", [])) - len(missing_indicators),
        len(state.get("requested_indicators", [])),
        len(missing_indicators),
    )

    return {
        **state,
        "missing_indicators": missing_indicators,
        "errors": errors,
        "country_name": country_name,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 5: Normalize Data
# ─────────────────────────────────────────────────────────────────────────────

def normalize_data(state: EconomicAgentState) -> EconomicAgentState:
    """
    Normalize raw World Bank results into clean EconomicData Pydantic schema.
    - Produces EconomicIndicator objects for all indicators.
    - Missing values remain None (never replaced with zero or fake values).
    - Source metadata is preserved.
    """
    iso3 = state["country_code"]
    raw_data = state.get("raw_data", {})

    def build_indicator(key: str) -> EconomicIndicator:
        meta = INDICATOR_METADATA.get(key, {})
        raw = raw_data.get(key, {})
        wb_code = WORLD_BANK_CODES.get(key, "")
        source_url = (
            raw.get("source_url")
            or f"https://data.worldbank.org/indicator/{wb_code}"
        )
        return EconomicIndicator(
            value=raw.get("value"),         # None if not available
            year=raw.get("year"),
            unit=meta.get("unit", ""),
            source="World Bank",
            source_url=source_url,
        )

    indicators = EconomicIndicators(
        gdp=build_indicator("gdp"),
        gdp_growth=build_indicator("gdp_growth"),
        gdp_per_capita=build_indicator("gdp_per_capita"),
        inflation=build_indicator("inflation"),
        unemployment=build_indicator("unemployment"),
        population=build_indicator("population"),
        fdi=build_indicator("fdi"),
    )

    economic_data = EconomicData(
        country_name=state.get("country_name", iso3),
        iso3=iso3,
        last_updated=datetime.now(timezone.utc).isoformat(),
        indicators=indicators,
        missing_indicators=state.get("missing_indicators", []),
        data_errors=state.get("errors", []),
    )

    logger.info(
        "Normalized economic data for %s — %d missing indicators",
        iso3,
        len(state.get("missing_indicators", [])),
    )

    return {
        **state,
        "economic_data": economic_data.model_dump(),
    }
