"""
Ecosphere Backend — Historical Economic Data Schemas

Mirror of the AI Service schemas used by the backend for response serialization.
"""

from typing import Optional
from pydantic import BaseModel, Field


class HistoricalIndicatorPoint(BaseModel):
    year: int
    value: Optional[float] = None
    unit: str
    source: str = "World Bank"
    source_url: Optional[str] = None


class HistoricalIndicator(BaseModel):
    indicator: str
    label: str = ""
    unit: str = ""
    points: list[HistoricalIndicatorPoint] = Field(default_factory=list)


class HistoricalEconomicData(BaseModel):
    country_name: str
    iso3: str
    indicators: dict[str, HistoricalIndicator]
    source: str = "World Bank"
    retrieved_at: str
    data_source: str = "world_bank"
