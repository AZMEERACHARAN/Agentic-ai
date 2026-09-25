"""
Ecosphere AI Service — Historical Economic Data Schemas

Canonical Pydantic models for historical economic time-series data.
Follows Step 3 & Step 4 specifications.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class HistoricalIndicatorPoint(BaseModel):
    """
    A single year's observation for an economic indicator.
    Missing values are represented as None (never fabricated as 0).
    """

    year: int
    value: Optional[float] = None
    unit: str
    source: str = "World Bank"
    source_url: Optional[str] = None

    @field_validator("value", mode="before")
    @classmethod
    def preserve_null_value(cls, v: object) -> Optional[float]:
        """Never silently replace None with 0."""
        if v is None:
            return None
        try:
            return float(v)  # type: ignore[arg-type]
        except (ValueError, TypeError):
            return None


class HistoricalIndicator(BaseModel):
    """Time-series observation points for a specific indicator."""

    indicator: str
    label: str = ""
    unit: str = ""
    points: list[HistoricalIndicatorPoint] = Field(default_factory=list)


class HistoricalEconomicData(BaseModel):
    """
    Complete historical economic dataset for a country across all core indicators.
    Returned to backend/frontend with provenance and cache metadata.
    """

    country_name: str
    iso3: str
    indicators: dict[str, HistoricalIndicator]
    source: str = "World Bank"
    retrieved_at: str
    data_source: str = "world_bank"  # "cache", "world_bank", or "hybrid"
