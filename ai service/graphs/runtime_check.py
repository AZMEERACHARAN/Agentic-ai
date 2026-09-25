"""
Ecosphere AI Service — LangGraph Runtime
Provides minimal LangGraph initialization verification.
"""

from typing import TypedDict

from langgraph.graph import StateGraph, END


class _MinimalState(TypedDict):
    """Minimal state type for LangGraph initialization check."""
    initialized: bool


def verify_langgraph() -> bool:
    """
    Verifies that LangGraph can be imported and a StateGraph can be constructed.

    This does NOT define any real agent workflow — it only confirms that
    the LangGraph runtime is functional.

    Returns:
        True if LangGraph initializes successfully.

    Raises:
        RuntimeError: If LangGraph initialization fails.
    """
    try:
        # Build a minimal graph to confirm the runtime works
        graph = StateGraph(_MinimalState)

        def _init_node(state: _MinimalState) -> _MinimalState:
            return {"initialized": True}

        graph.add_node("init", _init_node)
        graph.set_entry_point("init")
        graph.add_edge("init", END)

        # Compile (validates graph structure)
        graph.compile()

        return True
    except Exception as exc:
        raise RuntimeError(f"LangGraph initialization failed: {exc}") from exc
