"""
Ecosphere AI Service — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from config.gemini_client import is_gemini_configured, configure_gemini
from graphs.runtime_check import verify_langgraph
from api.economic import router as economic_router
from api.historical import router as historical_router

# ──────────────────────────────────────────────
# Startup: Verify LangGraph and Gemini
# ──────────────────────────────────────────────
_langgraph_ready: bool = False
_langgraph_error: str = ""

try:
    _langgraph_ready = verify_langgraph()
except RuntimeError as _e:
    _langgraph_error = str(_e)

# Attempt Gemini configuration at startup (non-fatal if key not set yet)
configure_gemini()

# ──────────────────────────────────────────────
# Application Instance
# ──────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Ecosphere Global Economic Intelligence — AI Service",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ──────────────────────────────────────────────
# CORS Middleware
# ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Next.js frontend (development)
        "http://localhost:8000",   # Backend (development)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Health Endpoint
# ──────────────────────────────────────────────
@app.get("/api/health")
async def health_check() -> dict:
    """
    Health check endpoint for the AI Service.

    Reports:
    - Service name and status
    - LangGraph agent runtime status (based on actual initialization)
    - Gemini configuration status
    """
    agent_runtime = "ready" if _langgraph_ready else "error"

    response: dict = {
        "service": "Ecosphere AI Service",
        "status": "healthy",
        "agent_runtime": agent_runtime,
        "gemini_configured": is_gemini_configured(),
    }

    if _langgraph_error:
        response["agent_runtime_error"] = _langgraph_error

    return response


# ──────────────────────────────────────────────
# Routers
# ──────────────────────────────────────────────
app.include_router(economic_router, prefix="/api")
app.include_router(historical_router, prefix="/api")
