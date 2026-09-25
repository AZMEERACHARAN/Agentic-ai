"""
Ecosphere AI Service — Economic Data Agent: State Definition

TypedDict-based LangGraph state for the Economic Data Agent.
Each field is updated by specific graph nodes.
"""

from typing import Optional, Any
from typing_extensions import TypedDict


class EconomicAgentState(TypedDict):
    """
    Typed state flowing through the Economic Data Agent LangGraph.

    Lifecycle:
    - country_code set at entry
    - validation_passed set by Validate Country node
    - country_name resolved by Validate Country node
    - requested_indicators set by Determine Indicators node
    - raw_data populated by Retrieve Data node
    - missing_indicators identified by Validate Data node
    - economic_data assembled by Normalize Data node
    - errors accumulated throughout the pipeline (non-fatal)
    - fatal_error set if the pipeline must abort early
    """

    # Input
    country_code: str

    # Validation
    validation_passed: bool
    country_name: str

    # Indicator planning
    requested_indicators: list[str]

    # Raw retrieval results (indicator_key → WorldBankRawIndicatorResult dict)
    raw_data: dict[str, Any]

    # Validation results
    missing_indicators: list[str]
    errors: list[str]

    # Final output
    economic_data: Optional[dict[str, Any]]

    # Set only on hard failure (e.g. invalid ISO3)
    fatal_error: Optional[str]
