"""
Pydantic schemas for AI Service
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class ProductBase(BaseModel):
    """Base product schema"""
    id: str
    name: str
    description: str
    price: float
    category: str
    rating: float
    review_count: int


class RecommendationRequest(BaseModel):
    """Request for product recommendations"""
    user_id: str
    product_id: Optional[str] = None
    category: Optional[str] = None
    limit: int = Field(default=10, le=50)
    min_rating: float = Field(default=0.0, ge=0, le=5)


class RecommendationResponse(BaseModel):
    """Response for product recommendations"""
    products: List[ProductBase]
    total: int
    algorithm: str = "collaborative-filtering"


class SmartSearchRequest(BaseModel):
    """Request for smart product search"""
    query: str = Field(..., min_length=1)
    filters: Optional[dict] = None
    limit: int = Field(default=20, le=100)


class SmartSearchResponse(BaseModel):
    """Response for smart search"""
    results: List[ProductBase]
    total: int
    query: str
    search_type: str = "semantic"


class ProductSummaryRequest(BaseModel):
    """Request for product summary generation"""
    product_id: str
    product_data: dict


class ProductSummaryResponse(BaseModel):
    """Response for product summary"""
    product_id: str
    summary: str
    key_features: List[str]
    best_for: str


class ConversationalRequest(BaseModel):
    """Request for conversational shopping"""
    user_id: str
    message: str
    context: Optional[dict] = None


class ConversationalResponse(BaseModel):
    """Response for conversational shopping"""
    user_id: str
    response: str
    recommended_products: Optional[List[ProductBase]] = None
    next_action: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
