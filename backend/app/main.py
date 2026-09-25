"""
Ecosphere Backend — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.economy import router as economy_router
from app.config.settings import settings
import os

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
origins = [
    "http://localhost:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Safely matches any Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

    # allow_credentials=True,
    # allow_methods=["*"],
    # allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Routers
# ──────────────────────────────────────────────
app.include_router(health_router, prefix="/api")
app.include_router(economy_router, prefix="/api")
