"""
Main FastAPI application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from app.routes import recommendations, search, summary, conversational, health

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="AI Premium Shop - AI Service",
    description="AI-powered shopping features microservice",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        os.getenv("BACKEND_URL", "http://localhost:3001"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
app.include_router(health.router, tags=["health"])
app.include_router(recommendations.router, tags=["recommendations"])
app.include_router(search.router, tags=["search"])
app.include_router(summary.router, tags=["summary"])
app.include_router(conversational.router, tags=["conversational"])


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "AI Enhanced Premium Shopping Experience - AI Service",
        "version": "0.1.0",
        "endpoints": [
            "/api/health",
            "/api/recommend",
            "/api/search",
            "/api/summary",
            "/api/chat",
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
