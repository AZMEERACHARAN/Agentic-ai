"""
Ecosphere AI Service — World Bank Tool Schemas

Pydantic models for raw World Bank API response parsing.
"""

from typing import Any, Optional
from pydantic import BaseModel, field_validator


class WorldBankMeta(BaseModel):
    """Metadata section returned at index 0 of the World Bank API list response."""
    page: int = 1
    pages: int = 1
    per_page: int = 1
    total: int = 0
    lastupdated: Optional[str] = None


class WorldBankDataPoint(BaseModel):
    """
    Single data point returned by the World Bank indicator API.
    Represents one country + indicator + year observation.
    """
    countryiso3code: str
    date: str          # World Bank returns year as a string e.g. "2024"
    value: Optional[float] = None   # null when data is not available

    @field_validator("value", mode="before")
    @classmethod
    def coerce_value(cls, v: Any) -> Optional[float]:
        """Convert numeric strings or None to float; return None for non-numeric."""
        if v is None:
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    @field_validator("date", mode="before")
    @classmethod
    def coerce_date(cls, v: Any) -> str:
        return str(v)


class WorldBankRawIndicatorResult(BaseModel):
    """
    Parsed result from a single World Bank indicator call.
    Stores the most-recent value found (mrv=1).
    """
    indicator_key: str          # Our canonical indicator name (e.g. "gdp")
    wb_code: str                # World Bank code (e.g. "NY.GDP.MKTP.CD")
    country_iso3: str
    value: Optional[float]
    year: Optional[int]         # Parsed from the 'date' string
    source: str = "World Bank"
    source_url: str = ""
    error: Optional[str] = None   # Set if the request failed
