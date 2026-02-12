# AI Service Documentation

## Overview

The AI Service is a FastAPI microservice that provides intelligent shopping features including product recommendations, semantic search, product summaries, and conversational shopping assistance.

## Getting Started

### Installation

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Development

```bash
python run.py
```

Service runs on `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## Features

### 1. Product Recommendations (`/api/recommend`)

Provides personalized product recommendations using collaborative filtering and content-based recommendation.

**Request:**
```json
{
  "user_id": "user_123",
  "product_id": "prod_456",
  "limit": 10,
  "min_rating": 4.0
}
```

**Response:**
```json
{
  "products": [
    {
      "id": "prod_789",
      "name": "Premium Wireless Headphones",
      "description": "High-quality wireless headphones",
      "price": 149.99,
      "category": "electronics",
      "rating": 4.5,
      "review_count": 128
    }
  ],
  "total": 1,
  "algorithm": "collaborative-filtering"
}
```

### 2. Smart Search (`/api/search`)

Semantic search using TF-IDF vectorization and cosine similarity.

**Request:**
```json
{
  "query": "wireless headphones",
  "filters": {
    "category": "electronics",
    "min_price": 50,
    "max_price": 300
  },
  "limit": 20
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "prod_123",
      "name": "Premium Wireless Headphones",
      "description": "...",
      "price": 149.99,
      "category": "electronics",
      "rating": 4.5,
      "review_count": 128,
      "relevance_score": 0.89
    }
  ],
  "total": 5,
  "query": "wireless headphones",
  "search_type": "semantic"
}
```

### 3. Product Summary (`/api/summary`)

Generates AI-powered product summaries and key features.

**Request:**
```json
{
  "product_id": "prod_123",
  "product_data": {
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "category": "electronics",
    "features": ["noise-cancelling", "wireless", "battery-30h"]
  }
}
```

**Response:**
```json
{
  "product_id": "prod_123",
  "summary": "Premium Wireless Headphones is a premium electronics product. High-quality wireless headphones with noise cancellation...",
  "key_features": ["noise", "cancelling", "wireless", "battery"],
  "best_for": "technology enthusiasts"
}
```

### 4. Conversational Shopping (`/api/chat`)

Chat-based shopping assistant with intent detection and recommendations.

**Request:**
```json
{
  "user_id": "user_123",
  "message": "Show me premium headphones under 200 dollars",
  "context": {
    "previous_searches": ["headphones", "audio"],
    "wishlist": ["prod_456"]
  }
}
```

**Response:**
```json
{
  "user_id": "user_123",
  "response": "I found some great premium headphones under $200. Would you like to see them?",
  "recommended_products": [
    {
      "id": "prod_789",
      "name": "Premium Wireless Headphones",
      "price": 149.99,
      "rating": 4.5
    }
  ],
  "next_action": "recommend"
}
```

## Project Structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── routes/                 # API endpoints
│   │   ├── __init__.py
│   │   ├── health.py           # Health check
│   │   ├── recommendations.py  # Recommendations endpoint
│   │   ├── search.py           # Search endpoint
│   │   ├── summary.py          # Summary endpoint
│   │   └── conversational.py   # Chat endpoint
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   └── ai_services.py      # AI algorithms
│   ├── schemas/                # Pydantic models
│   │   ├── __init__.py
│   │   └── schemas.py          # Request/response schemas
│   └── models/                 # ML models
├── tests/                      # Test files
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables
├── run.py                     # Entry point
└── README.md
```

## AI Algorithms

### Recommendation Algorithm

1. **Collaborative Filtering**: Based on user purchase history
2. **Category-Based**: Recommends products from user's favorite categories
3. **Rating-Based Boosting**: Prioritizes highly-rated products

### Search Algorithm

1. **TF-IDF Vectorization**: Converts product text to numerical vectors
2. **Cosine Similarity**: Calculates similarity between query and products
3. **Ranking**: Ranks products by relevance score

### Intent Detection

Analyzes user messages to determine shopping intent:
- `search` - User wants to find products
- `recommendation` - User wants suggestions
- `product_info` - User wants product details
- `help` - User needs assistance
- `general` - General conversation

## Environment Variables

Create `.env`:

```
# Server
HOST=0.0.0.0
PORT=8000
ENV=development
DEBUG=true

# Backend API
BACKEND_URL=http://localhost:3001
API_KEY=your_api_key

# Frontend
FRONTEND_URL=http://localhost:3000

# AI Configuration
MODEL_NAME=default-ai-model
MAX_RECOMMENDATIONS=10
MIN_RECOMMENDATION_SCORE=0.0

# Logging
LOG_LEVEL=INFO
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_recommendations.py

# Verbose output
pytest -v
```

## Performance Considerations

- **Caching**: Consider caching recommendations for popular users
- **Batch Processing**: Process recommendations in batches
- **Vector Similarity**: Use approximate nearest neighbor search for large datasets
- **Database Indexing**: Index product text fields for faster search

## Extending the Service

### Adding a New Endpoint

1. Create route file in `app/routes/`
2. Add business logic to `app/services/ai_services.py`
3. Define schemas in `app/schemas/schemas.py`
4. Include router in `app/main.py`

### Adding ML Models

1. Place model files in `app/models/`
2. Create service wrapper for model inference
3. Use in routes with proper error handling

## Integration with Backend

The AI service integrates with the NestJS backend:

```
Frontend (Next.js)
    ↓
Backend API (NestJS) - Routes to AI Service for intelligence
    ↓
AI Service (FastAPI) - Provides recommendations, search, etc.
```

### Backend Integration Example

```typescript
// In NestJS service
async function getRecommendations(userId: string) {
  const response = await axios.post(
    `${process.env.AI_SERVICE_URL}/api/recommend`,
    { user_id: userId, limit: 10 }
  );
  return response.data;
}
```

## Deployment

### Using Uvicorn

```bash
# Development
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Troubleshooting

### Module Import Errors

```bash
# Ensure you're in virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
python run.py --port 8001
```

### Database Connection Issues

Ensure backend is running and `BACKEND_URL` is correct in `.env`.

## Best Practices

1. **Validate Input**: Always validate request data
2. **Handle Errors**: Return meaningful error messages
3. **Cache Results**: Cache recommendations and search results
4. **Monitor Performance**: Track response times
5. **Log Activity**: Log all requests and errors
6. **Test Thoroughly**: Write unit and integration tests

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Pydantic Documentation](https://docs.pydantic.dev)
- [scikit-learn Documentation](https://scikit-learn.org)
- [Python Documentation](https://docs.python.org/3)

---

For more information, see the main [README.md](../README.md).
