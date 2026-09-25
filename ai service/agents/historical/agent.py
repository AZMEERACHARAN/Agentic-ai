"""
Ecosphere AI Service — Historical Data Agent: Node Implementations

Deterministic LangGraph nodes for historical economic data retrieval,
cache-first validation, World Bank querying, and structured normalization.
Never invokes Gemini for economic data generation.
"""

import asyncio
import logging
import re
from datetime import datetime, timezone
from typing import Any, Optional

from agents.historical.state import HistoricalAgentState
from services.supabase_cache import (
    get_cached_historical_observations,
    store_historical_observations,
)
from tools.worldbank.client import fetch_historical_indicator
from tools.worldbank.indicators import (
    ALL_INDICATORS,
    INDICATOR_METADATA,
    WORLD_BANK_CODES,
)
from utils.countries import is_valid_iso3, get_country_name

logger = logging.getLogger(__name__)

# Basic format: 3 uppercase letters
_ISO3_FORMAT = re.compile(r"^[A-Z]{3}$")

# Default historical span: target approximately 10 years (e.g. 2015 to 2024)
TARGET_YEAR_SPAN = 10


# ─────────────────────────────────────────────────────────────────────────────
# Node 1: Validate Country
# ─────────────────────────────────────────────────────────────────────────────

def validate_country(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Validate ISO 3166-1 alpha-3 country code.
    Rejects malformed codes and non-existent country codes (e.g. 'XXX')
    without querying external APIs.
    """
    raw_code = (state.get("country_code") or "").strip().upper()

    if not _ISO3_FORMAT.match(raw_code):
        return {
            **state,
            "country_code": raw_code,
            "validation_passed": False,
            "fatal_error": (
                f"Invalid ISO3 format: '{raw_code}'. "
                "Must be exactly 3 uppercase letters (e.g. IND, USA, CHN)."
            ),
        }

    if not is_valid_iso3(raw_code):
        logger.warning("Unknown/invalid ISO3 code rejected: '%s'", raw_code)
        return {
            **state,
            "country_code": raw_code,
            "validation_passed": False,
            "fatal_error": (
                f"Invalid ISO3 country code: '{raw_code}'. "
                "Not recognized as an official ISO 3166-1 alpha-3 territory."
            ),
        }

    c_name = get_country_name(raw_code) or raw_code
    logger.info("ISO3 validation successful: %s (%s)", raw_code, c_name)

    return {
        **state,
        "country_code": raw_code,
        "country_name": c_name,
        "validation_passed": True,
        "fatal_error": None,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 2: Determine Requested Years
# ─────────────────────────────────────────────────────────────────────────────

def determine_requested_years(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Determine target indicators and target 10-year span.
    Generates the target years list [2015..2024] or latest 10 years.
    """
    current_year = datetime.now(timezone.utc).year
    # For historical data, World Bank annual data is typically complete up to current_year - 2 or - 1
    # Target 10 years: e.g. 2015 to 2024 (10 years)
    end_year = current_year - 2 if current_year >= 2026 else current_year - 1
    start_year = end_year - TARGET_YEAR_SPAN + 1
    target_years = list(range(start_year, end_year + 1))

    logger.info(
        "Historical range determined for %s: %d years (%d to %d)",
        state["country_code"],
        len(target_years),
        start_year,
        end_year,
    )

    return {
        **state,
        "requested_indicators": list(ALL_INDICATORS),
        "target_years": target_years,
        "cached_observations": {},
        "missing_plan": {},
        "all_cached": False,
        "newly_retrieved": {},
        "combined_points": {},
        "errors": state.get("errors", []),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 3: Check Cache
# ─────────────────────────────────────────────────────────────────────────────

def check_cache(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Query Supabase historical_economic_data table for cached observations.
    Validates each cached observation row.
    """
    iso3 = state["country_code"]
    indicators = state["requested_indicators"]

    cached = get_cached_historical_observations(iso3, indicators)
    total_cached_points = sum(len(pts) for pts in cached.values())

    logger.info(
        "Cache check for %s: found %d cached points across %d indicators",
        iso3,
        total_cached_points,
        len(indicators),
    )

    return {
        **state,
        "cached_observations": cached,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 4: Identify Missing Years / Data
# ─────────────────────────────────────────────────────────────────────────────

def identify_missing_data(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Compare cached observations against the requested target years.
    Builds a missing_plan mapping indicator_key -> list of missing years.
    Sets all_cached = True if every indicator already has complete data in cache.
    """
    target_years = set(state["target_years"])
    cached = state["cached_observations"]
    missing_plan: dict[str, list[int]] = {}

    for ind in state["requested_indicators"]:
        cached_pts = cached.get(ind, [])
        cached_years = set(p["year"] for p in cached_pts)
        missing_years = sorted(list(target_years - cached_years))

        if missing_years:
            missing_plan[ind] = missing_years

    all_cached = len(missing_plan) == 0
    total_cached = sum(len(pts) for pts in cached.values())

    if all_cached:
        data_source = "cache"
        logger.info("All requested data for %s is present in cache! Zero external API calls needed.", state["country_code"])
    elif total_cached > 0:
        data_source = "hybrid"
        logger.info("Cache for %s is partial (%d cached). Missing %d indicator series.", state["country_code"], total_cached, len(missing_plan))
    else:
        data_source = "world_bank"
        logger.info("No cached data found for %s. Full World Bank retrieval required.", state["country_code"])

    return {
        **state,
        "missing_plan": missing_plan,
        "all_cached": all_cached,
        "data_source": data_source,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 5: Retrieve Missing Data (World Bank API)
# ─────────────────────────────────────────────────────────────────────────────

async def retrieve_missing_data(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Fetch only the missing data points from the World Bank API.
    If all_cached is True, this node executes in 0ms without making any HTTP requests.
    """
    if state["all_cached"]:
        return {
            **state,
            "newly_retrieved": {},
        }

    iso3 = state["country_code"]
    missing_plan = state["missing_plan"]
    target_years = state["target_years"]
    newly_retrieved: dict[str, list[dict[str, Any]]] = {}
    errors = list(state.get("errors", []))

    async def _fetch_indicator_missing(ind_key: str, missing_years: list[int]):
        # If all years are missing, fetch mrv=10
        if len(missing_years) == len(target_years):
            res = await fetch_historical_indicator(
                iso3=iso3,
                indicator_key=ind_key,
                years=len(target_years),
            )
        else:
            # Only specific missing years
            date_range = f"{min(missing_years)}:{max(missing_years)}"
            res = await fetch_historical_indicator(
                iso3=iso3,
                indicator_key=ind_key,
                date_range=date_range,
            )
        return ind_key, res

    tasks = [
        _fetch_indicator_missing(ind, yrs)
        for ind, yrs in missing_plan.items()
    ]

    results = await asyncio.gather(*tasks)

    for ind_key, res in results:
        if res.get("error"):
            errors.append(f"{ind_key}: {res['error']}")
        # Extract country name if available
        if res.get("country_name") and not state.get("country_name"):
            state["country_name"] = res["country_name"]

        newly_retrieved[ind_key] = res.get("points", [])

    logger.info(
        "Retrieved missing data for %s: %d new points across %d indicators",
        iso3,
        sum(len(pts) for pts in newly_retrieved.values()),
        len(newly_retrieved),
    )

    return {
        **state,
        "newly_retrieved": newly_retrieved,
        "errors": errors,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 6: Validate Source Response
# ─────────────────────────────────────────────────────────────────────────────

def validate_source_response(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Validate all retrieved data points:
    - Ensure year is integer.
    - Ensure value is numeric float or None (never convert None to 0).
    - Ensure unit and source provenance are properly set.
    """
    newly_retrieved = state["newly_retrieved"]
    cleaned_new: dict[str, list[dict[str, Any]]] = {}

    for ind_key, pts in newly_retrieved.items():
        cleaned_list: list[dict[str, Any]] = []
        unit = INDICATOR_METADATA.get(ind_key, {}).get("unit", "")

        for pt in pts:
            raw_yr = pt.get("year")
            if raw_yr is None:
                continue
            try:
                year = int(raw_yr)
            except (ValueError, TypeError):
                continue

            val = pt.get("value")
            if val is not None:
                try:
                    val = float(val)
                except (ValueError, TypeError):
                    val = None

            cleaned_list.append({
                "year": year,
                "value": val,
                "unit": pt.get("unit") or unit,
                "source": pt.get("source") or "World Bank",
                "source_url": pt.get("source_url") or "",
            })

        cleaned_new[ind_key] = cleaned_list

    return {
        **state,
        "newly_retrieved": cleaned_new,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 7: Normalize Data
# ─────────────────────────────────────────────────────────────────────────────

def normalize_data(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Merge cached observations and newly retrieved data into a cohesive time-series.
    Ensures every indicator has an entry with sorted points (ascending by year).
    Missing years are represented as None points (never omitted or set to 0).
    """
    cached = state["cached_observations"]
    new_data = state["newly_retrieved"]
    target_years = sorted(state["target_years"])
    normalized_indicators: dict[str, Any] = {}
    combined_for_storage: dict[str, list[dict[str, Any]]] = {}

    for ind_key in state["requested_indicators"]:
        meta = INDICATOR_METADATA.get(ind_key, {})
        label = meta.get("label", ind_key.upper())
        unit = meta.get("unit", "")
        wb_code = WORLD_BANK_CODES.get(ind_key, "")
        default_url = f"https://data.worldbank.org/indicator/{wb_code}?locations={state['country_code']}"

        # Combine cached + new points, indexing by year
        year_map: dict[int, dict[str, Any]] = {}

        # 1. Fill from cache
        for pt in cached.get(ind_key, []):
            year_map[pt["year"]] = {
                "year": pt["year"],
                "value": pt["value"],
                "unit": pt.get("unit") or unit,
                "source": pt.get("source") or "World Bank",
                "source_url": pt.get("source_url") or default_url,
            }

        # 2. Overlay / add from newly retrieved
        new_pts_to_store: list[dict[str, Any]] = []
        for pt in new_data.get(ind_key, []):
            yr = pt["year"]
            point_dict = {
                "year": yr,
                "value": pt["value"],
                "unit": pt.get("unit") or unit,
                "source": pt.get("source") or "World Bank",
                "source_url": pt.get("source_url") or default_url,
            }
            year_map[yr] = point_dict
            new_pts_to_store.append(point_dict)

        combined_for_storage[ind_key] = new_pts_to_store

        # 3. Ensure all target years have a point (fill missing target years with value=None)
        final_points: list[dict[str, Any]] = []
        for yr in target_years:
            if yr in year_map:
                final_points.append(year_map[yr])
            else:
                final_points.append({
                    "year": yr,
                    "value": None,
                    "unit": unit,
                    "source": "World Bank",
                    "source_url": default_url,
                })

        # Also include any available recent years that World Bank returned outside the strict target span
        for yr in sorted(year_map.keys()):
            if yr not in target_years:
                final_points.append(year_map[yr])

        # Sort strictly ascending by year
        final_points.sort(key=lambda p: p["year"])

        normalized_indicators[ind_key] = {
            "indicator": ind_key,
            "label": label,
            "unit": unit,
            "points": final_points,
        }

    return {
        **state,
        "normalized_indicators": normalized_indicators,
        "combined_points": combined_for_storage,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 8: Store Missing Data
# ─────────────────────────────────────────────────────────────────────────────

def store_missing_data(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Store newly fetched observations into Supabase cache.
    Does not re-insert observations that were already in the cache.
    """
    newly_fetched = state.get("combined_points", {})
    total_new = sum(len(pts) for pts in newly_fetched.values())

    if total_new > 0:
        stored = store_historical_observations(state["country_code"], newly_fetched)
        logger.info("Stored %d new historical observations in Supabase cache", stored)
    else:
        logger.info("No new observations to store in cache (100% cache hit)")

    return state


# ─────────────────────────────────────────────────────────────────────────────
# Node 9: Return Historical Dataset
# ─────────────────────────────────────────────────────────────────────────────

def return_historical_dataset(state: HistoricalAgentState) -> HistoricalAgentState:
    """
    Assemble the final HistoricalEconomicData response structure.
    """
    historical_data = {
        "country_name": state["country_name"],
        "iso3": state["country_code"],
        "indicators": state["normalized_indicators"],
        "source": "World Bank",
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "data_source": state.get("data_source", "world_bank"),
    }

    return {
        **state,
        "historical_data": historical_data,
    }
