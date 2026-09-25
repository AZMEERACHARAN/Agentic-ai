"""
Ecosphere AI Service — Historical Data Agent: LangGraph Workflow

Builds and compiles the Historical Data Agent as a LangGraph StateGraph.

Workflow:
  START
    ↓
  validate_country          — ISO3 format and existence check
    ↓ (if valid)
  determine_requested_years — decide target indicators and 10-year span
    ↓
  check_cache               — query Supabase historical_economic_data
    ↓
  identify_missing_data     — determine missing indicators/years
    ↓
  retrieve_missing_data     — fetch only missing points from World Bank
    ↓
  validate_source_response  — check data points, handle nulls
    ↓
  normalize_data            — assemble chronological time-series
    ↓
  store_missing_data        — upsert newly retrieved points to Supabase
    ↓
  return_historical_dataset — construct final HistoricalEconomicData
    ↓
  END

If validate_country fails, the graph short-circuits to END with fatal_error set.
"""

import logging
from typing import Literal

from langgraph.graph import StateGraph, END

from agents.historical.state import HistoricalAgentState
from agents.historical.agent import (
    validate_country,
    determine_requested_years,
    check_cache,
    identify_missing_data,
    retrieve_missing_data,
    validate_source_response,
    normalize_data,
    store_missing_data,
    return_historical_dataset,
)

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Conditional Routing
# ─────────────────────────────────────────────────────────────────────────────

def route_after_country_validation(
    state: HistoricalAgentState,
) -> Literal["determine_requested_years", "__end__"]:
    """Route to determine_requested_years if validation passed, else to END."""
    if state.get("validation_passed"):
        return "determine_requested_years"
    logger.warning(
        "Historical agent aborting early: %s",
        state.get("fatal_error", "Unknown validation error"),
    )
    return "__end__"


# ─────────────────────────────────────────────────────────────────────────────
# Graph Construction
# ─────────────────────────────────────────────────────────────────────────────

def build_historical_agent_graph() -> StateGraph:
    """
    Build the Historical Data Agent StateGraph.
    Returns uncompiled StateGraph.
    """
    graph = StateGraph(HistoricalAgentState)

    # Register all nodes
    graph.add_node("validate_country", validate_country)
    graph.add_node("determine_requested_years", determine_requested_years)
    graph.add_node("check_cache", check_cache)
    graph.add_node("identify_missing_data", identify_missing_data)
    graph.add_node("retrieve_missing_data", retrieve_missing_data)
    graph.add_node("validate_source_response", validate_source_response)
    graph.add_node("normalize_data", normalize_data)
    graph.add_node("store_missing_data", store_missing_data)
    graph.add_node("return_historical_dataset", return_historical_dataset)

    # Entry point
    graph.set_entry_point("validate_country")

    # Conditional edge: validate_country -> determine_requested_years | END
    graph.add_conditional_edges(
        "validate_country",
        route_after_country_validation,
        {
            "determine_requested_years": "determine_requested_years",
            "__end__": END,
        },
    )

    # Linear workflow for valid path
    graph.add_edge("determine_requested_years", "check_cache")
    graph.add_edge("check_cache", "identify_missing_data")
    graph.add_edge("identify_missing_data", "retrieve_missing_data")
    graph.add_edge("retrieve_missing_data", "validate_source_response")
    graph.add_edge("validate_source_response", "normalize_data")
    graph.add_edge("normalize_data", "store_missing_data")
    graph.add_edge("store_missing_data", "return_historical_dataset")
    graph.add_edge("return_historical_dataset", END)

    return graph


# ─────────────────────────────────────────────────────────────────────────────
# Singleton Compiled Graph
# ─────────────────────────────────────────────────────────────────────────────

_compiled_historical_graph = None


def get_historical_agent():
    """Return the compiled Historical Data Agent graph (singleton)."""
    global _compiled_historical_graph
    if _compiled_historical_graph is None:
        _compiled_historical_graph = build_historical_agent_graph().compile()
        logger.info("Historical Data Agent graph compiled successfully")
    return _compiled_historical_graph


async def run_historical_agent(iso3: str) -> dict:
    """
    Run the Historical Data Agent for a given ISO3 country code.

    Args:
        iso3: ISO 3166-1 alpha-3 country code

    Returns:
        Final HistoricalAgentState as a dict.
        Contains 'historical_data' on success, or 'fatal_error' on failure.
    """
    agent = get_historical_agent()

    initial_state: HistoricalAgentState = {
        "country_code": iso3,
        "country_name": "",
        "validation_passed": False,
        "fatal_error": None,
        "requested_indicators": [],
        "target_years": [],
        "cached_observations": {},
        "all_cached": False,
        "missing_plan": {},
        "newly_retrieved": {},
        "combined_points": {},
        "normalized_indicators": {},
        "data_source": "world_bank",
        "errors": [],
        "historical_data": None,
    }

    logger.info("Starting Historical Data Agent for ISO3: %s", iso3)
    final_state: dict = await agent.ainvoke(initial_state)
    logger.info(
        "Historical Data Agent completed for %s — historical_data present: %s, data_source: %s",
        iso3,
        final_state.get("historical_data") is not None,
        final_state.get("data_source"),
    )
    return final_state
