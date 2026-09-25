"""
Ecosphere Backend — Economic Data Schemas

Mirror of the AI Service schemas used by the backend for response serialization.
The backend passes through data from the AI Service to the frontend.
"""

from typing import Optional
from pydantic import BaseModel


class EconomicIndicator(BaseModel):
    value: Optional[float] = None
    year: Optional[int] = None
    unit: str
    source: str
    source_url: str


class EconomicIndicators(BaseModel):
    gdp: EconomicIndicator
    gdp_growth: EconomicIndicator
    gdp_per_capita: EconomicIndicator
    inflation: EconomicIndicator
    unemployment: EconomicIndicator
    population: EconomicIndicator
    fdi: EconomicIndicator


class EconomicData(BaseModel):
    country_name: str
    iso3: str
    last_updated: str
    indicators: EconomicIndicators
    missing_indicators: list[str] = []
    data_errors: list[str] = []


class EconomicDataRequest(BaseModel):
    iso3: str
    country_name: Optional[str] = None
