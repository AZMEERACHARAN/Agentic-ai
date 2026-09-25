"""
Ecosphere AI Service — Economic Data Agent: LangGraph Graph

Builds and compiles the Economic Data Agent as a LangGraph StateGraph.

Workflow:
  START
    ↓
  validate_country     — ISO3 format check
    ↓ (if valid)
  determine_indicators — decide which indicators to fetch
    ↓
  retrieve_data        — concurrent World Bank API calls
    ↓
  validate_data        — check values, identify missing indicators
    ↓
  normalize_data       — assemble EconomicData Pydantic output
    ↓
  END

If validate_country fails, the graph short-circuits directly to END
with fatal_error set in state.
"""

import logging
from typing import Literal

from langgraph.graph import StateGraph, END

from agents.economic.state import EconomicAgentState
from agents.economic.agent import (
    validate_country,
    determine_indicators,
    retrieve_data,
    validate_data,
    normalize_data,
)

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Conditional edge: route after validation
# ─────────────────────────────────────────────────────────────────────────────

def route_after_validation(
    state: EconomicAgentState,
) -> Literal["determine_indicators", "__end__"]:
    """Route to indicator determination if validation passed, else to END."""
    if state.get("validation_passed"):
        return "determine_indicators"
    logger.warning(
        "Economic agent terminating early: %s", state.get("fatal_error", "Unknown error")
    )
    return "__end__"


# ─────────────────────────────────────────────────────────────────────────────
# Graph construction
# ─────────────────────────────────────────────────────────────────────────────

def build_economic_agent_graph() -> StateGraph:
    """
    Build the Economic Data Agent StateGraph.

    Returns an uncompiled StateGraph.
    Call .compile() to get a runnable graph.
    """
    graph = StateGraph(EconomicAgentState)

    # Register all nodes
    graph.add_node("validate_country", validate_country)
    graph.add_node("determine_indicators", determine_indicators)
    graph.add_node("retrieve_data", retrieve_data)
    graph.add_node("validate_data", validate_data)
    graph.add_node("normalize_data", normalize_data)

    # Entry point
    graph.set_entry_point("validate_country")

    # Conditional edge: validation success → continue; failure → END
    graph.add_conditional_edges(
        "validate_country",
        route_after_validation,
        {
            "determine_indicators": "determine_indicators",
            "__end__": END,
        },
    )

    # Linear edges for successful path
    graph.add_edge("determine_indicators", "retrieve_data")
    graph.add_edge("retrieve_data", "validate_data")
    graph.add_edge("validate_data", "normalize_data")
    graph.add_edge("normalize_data", END)

    return graph


# ─────────────────────────────────────────────────────────────────────────────
# Compiled graph singleton
# ─────────────────────────────────────────────────────────────────────────────

_compiled_graph = None


def get_economic_agent():
    """Return the compiled Economic Data Agent graph (singleton)."""
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_economic_agent_graph().compile()
        logger.info("Economic Data Agent graph compiled successfully")
    return _compiled_graph


async def run_economic_agent(iso3: str) -> dict:
    """
    Run the Economic Data Agent for a given ISO3 country code.

    Args:
        iso3: ISO 3166-1 alpha-3 country code

    Returns:
        Final EconomicAgentState as a dict.
        Check state['economic_data'] for results.
        Check state['fatal_error'] for hard failures.
    """
    agent = get_economic_agent()

    initial_state: EconomicAgentState = {
        "country_code": iso3,
        "validation_passed": False,
        "country_name": "",
        "requested_indicators": [],
        "raw_data": {},
        "missing_indicators": [],
        "errors": [],
        "economic_data": None,
        "fatal_error": None,
    }

    logger.info("Starting Economic Data Agent for ISO3: %s", iso3)
    final_state: dict = await agent.ainvoke(initial_state)
    logger.info(
        "Economic Data Agent completed for %s — economic_data present: %s",
        iso3,
        final_state.get("economic_data") is not None,
    )
    return final_state
