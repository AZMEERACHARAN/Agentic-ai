"""
Ecosphere AI Service — World Bank API Client

Responsible for:
- Constructing World Bank API requests
- Sending HTTP requests with retry logic
- Parsing raw responses
- Handling HTTP errors and missing data
- Returning structured WorldBankRawIndicatorResult objects

Never calls Gemini. Never fabricates values.
"""

import logging
from typing import Optional, Any

import httpx

from tools.worldbank.indicators import (
    WORLD_BANK_CODES,
    INDICATOR_METADATA,
    ALL_INDICATORS,
)
from tools.worldbank.schemas import (
    WorldBankMeta,
    WorldBankDataPoint,
    WorldBankRawIndicatorResult,
)

logger = logging.getLogger(__name__)

# World Bank v2 JSON API base URL
_WB_BASE_URL = "https://api.worldbank.org/v2"

# HTTP client configuration
_REQUEST_TIMEOUT = 12.0       # seconds per request
_MAX_RETRIES = 2              # number of retry attempts on transient errors
_RETRY_DELAYS = [1.0, 2.0]   # seconds to wait before each retry


def _build_wb_url(iso3: str, wb_code: str) -> str:
    """Construct the World Bank indicator URL for a given country and indicator."""
    return (
        f"{_WB_BASE_URL}/country/{iso3}/indicator/{wb_code}"
        "?format=json&mrv=1&per_page=1"
    )


def _parse_wb_response(
    raw: list[Any],
    indicator_key: str,
    wb_code: str,
    iso3: str,
    source_url: str,
) -> WorldBankRawIndicatorResult:
    """
    Parse the World Bank JSON response list [meta, [datapoints]].

    The API returns a list of length 2:
    - index 0: metadata dict
    - index 1: list of data point dicts (or None for invalid country)

    Returns WorldBankRawIndicatorResult with parsed value/year, or error set.
    """
    try:
        if not isinstance(raw, list) or len(raw) < 2:
            return WorldBankRawIndicatorResult(
                indicator_key=indicator_key,
                wb_code=wb_code,
                country_iso3=iso3,
                value=None,
                year=None,
                source_url=source_url,
                error="Unexpected response format from World Bank API",
            )

        # Index 1 is the data array; may be None for unknown country codes
        data_list = raw[1]

        if data_list is None or not isinstance(data_list, list) or len(data_list) == 0:
            return WorldBankRawIndicatorResult(
                indicator_key=indicator_key,
                wb_code=wb_code,
                country_iso3=iso3,
                value=None,
                year=None,
                source_url=source_url,
                error=None,  # Not an error — data simply unavailable
            )

        # Parse the first (most recent) data point
        raw_point: dict = data_list[0]
        point = WorldBankDataPoint(
            countryiso3code=raw_point.get("countryiso3code", iso3),
            date=str(raw_point.get("date", "")),
            value=raw_point.get("value"),
        )

        year: Optional[int] = None
        if point.date and point.date.isdigit():
            year = int(point.date)

        return WorldBankRawIndicatorResult(
            indicator_key=indicator_key,
            wb_code=wb_code,
            country_iso3=iso3,
            value=point.value,
            year=year,
            source_url=source_url,
        )

    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "Failed to parse World Bank response for %s/%s: %s",
            iso3,
            wb_code,
            exc,
        )
        return WorldBankRawIndicatorResult(
            indicator_key=indicator_key,
            wb_code=wb_code,
            country_iso3=iso3,
            value=None,
            year=None,
            source_url=source_url,
            error=f"Parse error: {exc}",
        )


async def fetch_indicator(
    iso3: str,
    indicator_key: str,
) -> WorldBankRawIndicatorResult:
    """
    Fetch a single World Bank indicator for a country with retry logic.

    Args:
        iso3: ISO 3166-1 alpha-3 country code (e.g. "IND")
        indicator_key: One of the canonical indicator names (e.g. "gdp")

    Returns:
        WorldBankRawIndicatorResult — always returns an object, never raises.
        Error information is embedded in the .error field.
    """
    wb_code = WORLD_BANK_CODES.get(indicator_key)
    if not wb_code:
        return WorldBankRawIndicatorResult(
            indicator_key=indicator_key,
            wb_code="",
            country_iso3=iso3,
            value=None,
            year=None,
            error=f"Unknown indicator key: '{indicator_key}'",
        )

    url = _build_wb_url(iso3, wb_code)
    last_error: str = ""

    async with httpx.AsyncClient(timeout=_REQUEST_TIMEOUT) as client:
        for attempt in range(_MAX_RETRIES + 1):
            try:
                response = await client.get(url)
                response.raise_for_status()
                raw = response.json()

                return _parse_wb_response(
                    raw=raw,
                    indicator_key=indicator_key,
                    wb_code=wb_code,
                    iso3=iso3,
                    source_url=url,
                )

            except httpx.HTTPStatusError as exc:
                last_error = f"HTTP {exc.response.status_code}: {exc.response.text[:120]}"
                # 4xx errors are not retried (they indicate a real problem)
                if exc.response.status_code < 500:
                    logger.warning(
                        "World Bank 4xx for %s/%s (attempt %d): %s",
                        iso3,
                        wb_code,
                        attempt + 1,
                        last_error,
                    )
                    break

            except (httpx.TimeoutException, httpx.ConnectError) as exc:
                last_error = f"Network error: {exc}"
                logger.warning(
                    "World Bank network error for %s/%s (attempt %d/%d): %s",
                    iso3,
                    wb_code,
                    attempt + 1,
                    _MAX_RETRIES + 1,
                    exc,
                )

            except Exception as exc:  # noqa: BLE001
                last_error = f"Unexpected error: {exc}"
                logger.error(
                    "Unexpected error fetching %s/%s: %s", iso3, wb_code, exc
                )
                break

            # Wait before retry (except on last attempt)
            if attempt < _MAX_RETRIES:
                import asyncio
                delay = _RETRY_DELAYS[min(attempt, len(_RETRY_DELAYS) - 1)]
                await asyncio.sleep(delay)

    return WorldBankRawIndicatorResult(
        indicator_key=indicator_key,
        wb_code=wb_code,
        country_iso3=iso3,
        value=None,
        year=None,
        source_url=url,
        error=last_error or "Failed after retries",
    )


async def fetch_all_indicators(
    iso3: str,
    indicator_keys: Optional[list[str]] = None,
) -> list[WorldBankRawIndicatorResult]:
    """
    Fetch multiple indicators concurrently for a country (most recent value).

    Args:
        iso3: ISO 3166-1 alpha-3 country code
        indicator_keys: List of canonical indicator names. Defaults to ALL_INDICATORS.

    Returns:
        List of WorldBankRawIndicatorResult, one per indicator.
    """
    import asyncio

    keys = indicator_keys or ALL_INDICATORS
    tasks = [fetch_indicator(iso3, key) for key in keys]
    results: list[WorldBankRawIndicatorResult] = await asyncio.gather(*tasks)
    return list(results)


# ──────────────────────────────────────────────────────────────────────────────
# Historical Time-Series Fetching
# ──────────────────────────────────────────────────────────────────────────────

def _build_wb_historical_url(
    iso3: str,
    wb_code: str,
    years: int = 10,
    date_range: Optional[str] = None,
) -> str:
    """
    Construct World Bank URL for historical observations.
    - If date_range is provided (e.g. "2021" or "2015:2024"), queries that exact period.
    - Otherwise uses mrv={years} to retrieve the latest N available years.
    """
    if date_range:
        return (
            f"{_WB_BASE_URL}/country/{iso3}/indicator/{wb_code}"
            f"?format=json&date={date_range}&per_page=50"
        )
    return (
        f"{_WB_BASE_URL}/country/{iso3}/indicator/{wb_code}"
        f"?format=json&mrv={years}&per_page={max(years, 10)}"
    )


def _parse_wb_historical_response(
    raw: list[Any],
    indicator_key: str,
    wb_code: str,
    iso3: str,
    source_url: str,
) -> tuple[Optional[str], list[dict[str, Any]], Optional[str]]:
    """
    Parse World Bank list response into historical points.
    Returns (country_name, list_of_points, error).
    Points are guaranteed to have year (int) and value (float or None).
    """
    unit = INDICATOR_METADATA.get(indicator_key, {}).get("unit", "")
    country_name: Optional[str] = None

    if not isinstance(raw, list) or len(raw) < 2:
        return None, [], "Unexpected response format from World Bank API"

    data_list = raw[1]
    if data_list is None or not isinstance(data_list, list) or len(data_list) == 0:
        return None, [], None

    points: list[dict[str, Any]] = []

    for raw_point in data_list:
        if not isinstance(raw_point, dict):
            continue

        if not country_name:
            c_info = raw_point.get("country")
            if isinstance(c_info, dict) and c_info.get("value"):
                country_name = str(c_info["value"])

        date_str = str(raw_point.get("date", "")).strip()
        if not date_str.isdigit():
            continue

        year = int(date_str)
        raw_val = raw_point.get("value")
        val: Optional[float] = None
        if raw_val is not None:
            try:
                val = float(raw_val)
            except (ValueError, TypeError):
                val = None

        points.append({
            "year": year,
            "value": val,
            "unit": unit,
            "source": "World Bank",
            "source_url": source_url,
        })

    # Sort ascending by year (e.g. 2015 -> 2024)
    points.sort(key=lambda p: p["year"])
    return country_name, points, None


async def fetch_historical_indicator(
    iso3: str,
    indicator_key: str,
    years: int = 10,
    date_range: Optional[str] = None,
) -> dict[str, Any]:
    """
    Fetch historical time-series for a single indicator.
    Supports specific date ranges (e.g. '2021' or '2015:2024') or last N years (mrv=N).

    Returns a dict with:
        indicator_key, wb_code, country_iso3, country_name, points, source_url, error
    """
    wb_code = WORLD_BANK_CODES.get(indicator_key)
    if not wb_code:
        return {
            "indicator_key": indicator_key,
            "wb_code": "",
            "country_iso3": iso3,
            "country_name": None,
            "points": [],
            "source_url": "",
            "error": f"Unknown indicator key: '{indicator_key}'",
        }

    url = _build_wb_historical_url(iso3, wb_code, years=years, date_range=date_range)
    last_error: str = ""

    async with httpx.AsyncClient(timeout=_REQUEST_TIMEOUT) as client:
        for attempt in range(_MAX_RETRIES + 1):
            try:
                response = await client.get(url)
                response.raise_for_status()
                raw = response.json()

                c_name, points, parse_err = _parse_wb_historical_response(
                    raw=raw,
                    indicator_key=indicator_key,
                    wb_code=wb_code,
                    iso3=iso3,
                    source_url=url,
                )

                return {
                    "indicator_key": indicator_key,
                    "wb_code": wb_code,
                    "country_iso3": iso3,
                    "country_name": c_name,
                    "points": points,
                    "source_url": url,
                    "error": parse_err,
                }

            except httpx.HTTPStatusError as exc:
                last_error = f"HTTP {exc.response.status_code}: {exc.response.text[:120]}"
                if exc.response.status_code < 500:
                    break

            except (httpx.TimeoutException, httpx.ConnectError) as exc:
                last_error = f"Network error: {exc}"

            except Exception as exc:  # noqa: BLE001
                last_error = f"Unexpected error: {exc}"
                break

            if attempt < _MAX_RETRIES:
                import asyncio
                delay = _RETRY_DELAYS[min(attempt, len(_RETRY_DELAYS) - 1)]
                await asyncio.sleep(delay)

    return {
        "indicator_key": indicator_key,
        "wb_code": wb_code,
        "country_iso3": iso3,
        "country_name": None,
        "points": [],
        "source_url": url,
        "error": last_error or "Failed after retries",
    }


async def fetch_all_historical_indicators(
    iso3: str,
    indicator_keys: Optional[list[str]] = None,
    years: int = 10,
    date_range: Optional[str] = None,
) -> list[dict[str, Any]]:
    """
    Fetch historical time-series for multiple indicators concurrently.
    """
    import asyncio

    keys = indicator_keys or ALL_INDICATORS
    tasks = [
        fetch_historical_indicator(
            iso3=iso3,
            indicator_key=k,
            years=years,
            date_range=date_range,
        )
        for k in keys
    ]
    results = await asyncio.gather(*tasks)
    return list(results)

