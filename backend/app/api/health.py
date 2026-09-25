"""
Ecosphere Backend — Health Check Router
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict:
    """
    Health check endpoint.

    Returns the service name and current health status.
    """
    return {
        "service": "Ecosphere Backend",
        "status": "healthy",
    }
