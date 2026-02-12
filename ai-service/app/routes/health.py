"""
Health check routes
"""

from fastapi import APIRouter
from app.schemas.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "version": "0.1.0"
    }
