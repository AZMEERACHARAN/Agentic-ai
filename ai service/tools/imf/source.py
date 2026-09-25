"""
Ecosphere AI Service — IMF Data Source Interface

Defines the contract for an IMF data source.
Full implementation is deferred to a future step.

The interface ensures that the Economic Data Agent can accept
either World Bank or IMF as interchangeable data providers.
"""

from abc import ABC, abstractmethod
from typing import Optional

from tools.worldbank.schemas import WorldBankRawIndicatorResult


class EconomicDataSource(ABC):
    """Abstract base class for all economic data sources."""

    @abstractmethod
    async def fetch_indicator(
        self,
        iso3: str,
        indicator_key: str,
    ) -> WorldBankRawIndicatorResult:
        """Fetch a single indicator for a country."""
        ...

    @abstractmethod
    async def fetch_all_indicators(
        self,
        iso3: str,
        indicator_keys: Optional[list[str]] = None,
    ) -> list[WorldBankRawIndicatorResult]:
        """Fetch all requested indicators for a country concurrently."""
        ...


class IMFDataSource(EconomicDataSource):
    """
    IMF data source stub — infrastructure placeholder for future integration.

    The IMF will be used in a future step for:
    - Validation of World Bank data
    - Additional macroeconomic indicators
    - Cross-source consistency checks

    DO NOT implement economic retrieval here until Step N (IMF integration).
    """

    async def fetch_indicator(
        self,
        iso3: str,
        indicator_key: str,
    ) -> WorldBankRawIndicatorResult:
        raise NotImplementedError(
            "IMF data source not yet implemented. "
            "Use WorldBankDataSource for Step 3."
        )

    async def fetch_all_indicators(
        self,
        iso3: str,
        indicator_keys: Optional[list[str]] = None,
    ) -> list[WorldBankRawIndicatorResult]:
        raise NotImplementedError(
            "IMF data source not yet implemented. "
            "Use WorldBankDataSource for Step 3."
        )
