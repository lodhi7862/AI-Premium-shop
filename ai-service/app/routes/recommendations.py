"""
Product recommendation routes
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.schemas import RecommendationRequest, RecommendationResponse, ProductBase
from app.services.ai_services import RecommendationService

router = APIRouter(prefix="/api", tags=["recommendations"])

# Mock products database
MOCK_PRODUCTS = [
    {
        "id": "p1",
        "name": "Premium Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 149.99,
        "category": "electronics",
        "rating": 4.5,
        "review_count": 128,
        "active": True
    },
    {
        "id": "p2",
        "name": "Premium Cotton T-Shirt",
        "description": "Comfortable premium cotton t-shirt",
        "price": 39.99,
        "category": "fashion",
        "rating": 4.2,
        "review_count": 45,
        "active": True
    },
    {
        "id": "p3",
        "name": "Smart Home Security Camera",
        "description": "4K Smart home security camera with AI detection",
        "price": 299.99,
        "category": "electronics",
        "rating": 4.8,
        "review_count": 95,
        "active": True
    },
]


@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized product recommendations
    """
    try:
        # In production, fetch real user history from database
        user_history = []

        recommendations = await RecommendationService.get_recommendations(
            user_id=request.user_id,
            all_products=MOCK_PRODUCTS,
            user_history=user_history,
            limit=request.limit,
            min_rating=request.min_rating
        )

        products = [ProductBase(**p) for p in recommendations]

        return RecommendationResponse(
            products=products,
            total=len(products),
            algorithm="collaborative-filtering"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
