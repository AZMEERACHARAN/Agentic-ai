"""
Ecosphere AI Service — Economic Data Schemas

Canonical Pydantic models for economic indicator data.
These are the output schemas of the Economic Data Agent.
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, field_validator


class EconomicIndicator(BaseModel):
    """
    A single economic indicator with its verified value and source metadata.

    - value is null when the indicator is unavailable (never fabricated).
    - year reflects the year of the data point retrieved.
    - source and source_url must always be present for transparency.
    """

    value: Optional[float] = None
    year: Optional[int] = None
    unit: str
    source: str
    source_url: str

    @field_validator("value", mode="before")
    @classmethod
    def disallow_fake_zero(cls, v: object) -> Optional[float]:
        """Keep None as None — never silently replace with 0."""
        if v is None:
            return None
        return float(v)  # type: ignore[arg-type]


class EconomicIndicators(BaseModel):
    """
    Full set of economic indicators returned by the Economic Data Agent.
    Each field must always be present; missing data is represented by value=None.
    """

    gdp: EconomicIndicator
    gdp_growth: EconomicIndicator
    gdp_per_capita: EconomicIndicator
    inflation: EconomicIndicator
    unemployment: EconomicIndicator
    population: EconomicIndicator
    fdi: EconomicIndicator


class EconomicData(BaseModel):
    """
    Structured economic data for a country.
    Produced by the Economic Data Agent and returned to the backend/frontend.
    """

    country_name: str
    iso3: str
    last_updated: str
    indicators: EconomicIndicators
    missing_indicators: list[str] = []   # Keys where value is None
    data_errors: list[str] = []          # Non-fatal errors encountered during retrieval


class EconomicDataRequest(BaseModel):
    """Request model for triggering the Economic Data Agent."""
    iso3: str
    country_name: Optional[str] = None


class EconomicDataError(BaseModel):
    """Returned when economic data retrieval fails completely."""
    iso3: str
    error: str
    detail: Optional[str] = None
