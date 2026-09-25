"""
Ecosphere AI Service — Supabase Historical Economic Data Cache

Handles cache-first retrieval, validation, and storage of historical economic observations.
Prevents duplicate queries to the World Bank API.
"""

import logging
from typing import Any, Optional
from datetime import datetime, timezone

from config.supabase_client import get_supabase_client
from tools.worldbank.indicators import ALL_INDICATORS

logger = logging.getLogger(__name__)

TABLE_NAME = "historical_economic_data"


def validate_cached_row(row: dict[str, Any], expected_iso3: str) -> Optional[dict[str, Any]]:
    """
    Validate a single cached row read from Supabase.
    Ensures:
    - country_iso3 matches expected ISO3
    - indicator_code is one of the valid indicators
    - year is a valid integer between 1960 and 2100
    - value is float or None (never fabricated)
    - unit and source are non-empty strings
    Returns cleaned dict or None if invalid.
    """
    try:
        iso3 = str(row.get("country_iso3", "")).strip().upper()
        if iso3 != expected_iso3:
            return None

        indicator_code = str(row.get("indicator_code", "")).strip()
        if indicator_code not in ALL_INDICATORS:
            return None

        raw_year = row.get("year")
        if raw_year is None:
            return None
        year = int(raw_year)
        if not (1960 <= year <= 2100):
            return None

        raw_val = row.get("value")
        val: Optional[float] = None
        if raw_val is not None:
            try:
                val = float(raw_val)
            except (ValueError, TypeError):
                val = None

        unit = str(row.get("unit") or "").strip()
        source = str(row.get("source") or "World Bank").strip()
        source_url = str(row.get("source_url") or "").strip()

        return {
            "year": year,
            "value": val,
            "unit": unit,
            "source": source,
            "source_url": source_url,
            "indicator_code": indicator_code,
            "country_iso3": iso3,
        }
    except Exception as exc:
        logger.warning("Error validating cached row: %s (row: %s)", exc, row)
        return None


def get_cached_historical_observations(
    iso3: str,
    indicator_keys: list[str],
) -> dict[str, list[dict[str, Any]]]:
    """
    Retrieve and validate cached historical observations from Supabase.
    Returns:
        dict mapping indicator_key -> list of validated observation dicts.
    """
    client = get_supabase_client()
    result: dict[str, list[dict[str, Any]]] = {k: [] for k in indicator_keys}

    if not client:
        logger.warning("Supabase client unavailable; skipping cache read.")
        return result

    try:
        response = (
            client.table(TABLE_NAME)
            .select("*")
            .eq("country_iso3", iso3.upper())
            .in_("indicator_code", indicator_keys)
            .execute()
        )

        rows = response.data or []
        logger.info("Found %d cached rows for %s in Supabase", len(rows), iso3)

        for row in rows:
            validated = validate_cached_row(row, iso3.upper())
            if validated:
                ind_key = validated["indicator_code"]
                if ind_key in result:
                    result[ind_key].append({
                        "year": validated["year"],
                        "value": validated["value"],
                        "unit": validated["unit"],
                        "source": validated["source"],
                        "source_url": validated["source_url"],
                    })

        # Sort each indicator's points ascending by year
        for ind_key in result:
            result[ind_key].sort(key=lambda p: p["year"])

        return result

    except Exception as exc:
        logger.error("Failed to query Supabase historical cache for %s: %s", iso3, exc)
        return result


def store_historical_observations(
    iso3: str,
    points_by_indicator: dict[str, list[dict[str, Any]]],
) -> int:
    """
    Upsert newly retrieved historical observations into Supabase.
    Uses conflict resolution on (country_iso3, indicator_code, year, source).
    Returns count of stored rows.
    """
    client = get_supabase_client()
    if not client:
        logger.warning("Supabase client unavailable; skipping cache write.")
        return 0

    rows_to_insert: list[dict[str, Any]] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for ind_key, points in points_by_indicator.items():
        for pt in points:
            rows_to_insert.append({
                "country_iso3": iso3.upper(),
                "indicator_code": ind_key,
                "year": pt["year"],
                "value": pt["value"],
                "unit": pt.get("unit", ""),
                "source": pt.get("source", "World Bank"),
                "source_url": pt.get("source_url", ""),
                "retrieved_at": now_iso,
                "updated_at": now_iso,
            })

    if not rows_to_insert:
        return 0

    try:
        # Batch in chunks of 100 to avoid payload limits
        chunk_size = 100
        total_stored = 0
        for i in range(0, len(rows_to_insert), chunk_size):
            chunk = rows_to_insert[i : i + chunk_size]
            res = (
                client.table(TABLE_NAME)
                .upsert(chunk, on_conflict="country_iso3,indicator_code,year,source")
                .execute()
            )
            total_stored += len(res.data or [])

        logger.info("Successfully stored %d observations in Supabase for %s", total_stored, iso3)
        return total_stored

    except Exception as exc:
        logger.error("Failed to write to Supabase historical cache for %s: %s", iso3, exc)
        return 0
