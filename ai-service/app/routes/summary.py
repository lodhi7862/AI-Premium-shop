"""
Product summary generation routes
"""

from fastapi import APIRouter, HTTPException
from app.schemas.schemas import ProductSummaryRequest, ProductSummaryResponse
from app.services.ai_services import SummaryService

router = APIRouter(prefix="/api", tags=["summary"])


@router.post("/summary", response_model=ProductSummaryResponse)
async def generate_product_summary(request: ProductSummaryRequest):
    """
    Generate AI-powered product summary and key features
    """
    try:
        summary_data = await SummaryService.generate_summary(request.product_data)

        return ProductSummaryResponse(
            product_id=request.product_id,
            summary=summary_data['summary'],
            key_features=summary_data['key_features'],
            best_for=summary_data['best_for']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
