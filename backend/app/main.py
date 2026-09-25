"""
Ecosphere Backend — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.economy import router as economy_router
from app.config.settings import settings

# ──────────────────────────────────────────────
# Application Instance
# ──────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Ecosphere Global Economic Intelligence — Backend API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ──────────────────────────────────────────────
# CORS Middleware
# ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js frontend (development)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Routers
# ──────────────────────────────────────────────
app.include_router(health_router, prefix="/api")
app.include_router(economy_router, prefix="/api")
