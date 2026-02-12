"""
Smart search routes
"""

from fastapi import APIRouter, HTTPException
from app.schemas.schemas import SmartSearchRequest, SmartSearchResponse, ProductBase
from app.services.ai_services import SearchService

router = APIRouter(prefix="/api", tags=["search"])

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


@router.post("/search", response_model=SmartSearchResponse)
async def smart_search(request: SmartSearchRequest):
    """
    Perform smart semantic search on products
    """
    try:
        results = await SearchService.semantic_search(
            query=request.query,
            products=MOCK_PRODUCTS,
            limit=request.limit
        )

        products = [ProductBase(**r) for r in results]

        return SmartSearchResponse(
            results=products,
            total=len(products),
            query=request.query,
            search_type="semantic"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
