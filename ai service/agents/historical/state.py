"""
Ecosphere AI Service — Historical Data Agent: State Definition

TypedDict-based LangGraph state for the Historical Data Agent.
Each field is populated and updated by specific graph nodes.
"""

from typing import Optional, Any
from typing_extensions import TypedDict


class HistoricalAgentState(TypedDict):
    """
    Typed state flowing through the Historical Data Agent LangGraph.

    Lifecycle:
    1. country_code (input)
    2. validation_passed & country_name (validate_country)
    3. requested_indicators & target_years (determine_requested_years)
    4. cached_observations (check_cache)
    5. missing_plan & all_cached (identify_missing_data)
    6. newly_retrieved (retrieve_missing_data)
    7. validated_points (validate_source_response)
    8. normalized_indicators & data_source (normalize_data)
    9. stored_count (store_missing_data)
    10. historical_data (return_historical_dataset)
    """

    # Input & Validation
    country_code: str
    country_name: str
    validation_passed: bool
    fatal_error: Optional[str]

    # Target Configuration
    requested_indicators: list[str]
    target_years: list[int]

    # Cache State
    cached_observations: dict[str, list[dict[str, Any]]]
    all_cached: bool

    # Missing Data Plan
    # Map of indicator_key -> list of missing years (or empty list if complete)
    missing_plan: dict[str, list[int]]

    # Retrieval from World Bank
    newly_retrieved: dict[str, list[dict[str, Any]]]

    # Validated & Combined points
    combined_points: dict[str, list[dict[str, Any]]]

    # Output assembly
    normalized_indicators: dict[str, Any]
    data_source: str  # "cache", "world_bank", "hybrid"
    errors: list[str]

    # Final Pydantic-compatible output dict
    historical_data: Optional[dict[str, Any]]
