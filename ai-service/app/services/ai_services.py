"""
AI Services for product recommendations and search
"""

from typing import List, Dict, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class RecommendationService:
    """
    Service for product recommendations
    Uses collaborative filtering and content-based recommendations
    """

    @staticmethod
    async def get_recommendations(
        user_id: str,
        all_products: List[Dict],
        user_history: List[Dict],
        limit: int = 10,
        min_rating: float = 0.0
    ) -> List[Dict]:
        """
        Get personalized product recommendations for a user
        """
        if not all_products:
            return []

        # Filter by rating
        filtered_products = [
            p for p in all_products
            if p.get('rating', 0) >= min_rating
        ]

        # Simple collaborative filtering: recommend products similar to user's history
        if user_history:
            # Get categories from user history
            user_categories = set()
            for item in user_history:
                if 'category' in item:
                    user_categories.add(item['category'])

            # Score products based on similarity to user history
            recommendations = []
            for product in filtered_products:
                if product['id'] in [h['id'] for h in user_history]:
                    continue  # Skip already purchased products

                score = 0
                if product.get('category') in user_categories:
                    score += 2

                # Boost high-rated products
                score += product.get('rating', 0) * 0.5

                recommendations.append((product, score))

            # Sort by score and return top N
            recommendations.sort(key=lambda x: x[1], reverse=True)
            return [r[0] for r in recommendations[:limit]]

        # If no user history, recommend best-rated products
        return sorted(
            filtered_products,
            key=lambda p: p.get('rating', 0),
            reverse=True
        )[:limit]


class SearchService:
    """
    Service for smart semantic search
    """

    @staticmethod
    async def semantic_search(
        query: str,
        products: List[Dict],
        limit: int = 20
    ) -> List[Dict]:
        """
        Perform semantic search on products
        """
        if not products or not query:
            return []

        # Extract searchable text from products
        product_texts = []
        product_ids = []

        for product in products:
            if not product.get('active', True):
                continue

            text = f"{product.get('name', '')} {product.get('description', '')}".lower()
            product_texts.append(text)
            product_ids.append(product['id'])

        if not product_texts:
            return []

        try:
            # Use TF-IDF vectorization for simple semantic similarity
            vectorizer = TfidfVectorizer(
                lowercase=True,
                stop_words='english',
                max_features=5000
            )

            # Fit and transform
            tfidf_matrix = vectorizer.fit_transform(product_texts + [query.lower()])

            # Calculate similarities
            similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]

            # Get top matches
            top_indices = np.argsort(similarities)[::-1][:limit]

            results = [
                {**products[i], 'relevance_score': float(similarities[i])}
                for i in top_indices
                if similarities[i] > 0.0
            ]

            return results
        except Exception as e:
            print(f"Search error: {e}")
            # Fallback to simple text matching
            return SearchService._simple_search(query, products, limit)

    @staticmethod
    def _simple_search(query: str, products: List[Dict], limit: int) -> List[Dict]:
        """Fallback simple text search"""
        query_lower = query.lower()
        matches = [
            p for p in products
            if (query_lower in p.get('name', '').lower() or
                query_lower in p.get('description', '').lower())
        ]
        return matches[:limit]


class SummaryService:
    """
    Service for generating product summaries
    """

    @staticmethod
    async def generate_summary(product_data: Dict) -> Dict:
        """
        Generate a concise summary and key features for a product
        """
        name = product_data.get('name', '')
        description = product_data.get('description', '')
        category = product_data.get('category', '')

        # Simple rule-based summary generation
        summary = f"{name} is a premium {category.lower()} product. {description[:150]}..."

        # Extract key features (simple approach)
        key_features = []
        if 'features' in product_data:
            key_features = product_data['features'][:5]
        else:
            # Extract from description
            words = description.split()
            key_features = [w for w in words[:5] if len(w) > 4]

        # Determine best use case
        best_for_mapping = {
            'electronics': 'technology enthusiasts',
            'fashion': 'style-conscious buyers',
            'home': 'home improvement',
            'sports': 'active lifestyle',
        }

        best_for = best_for_mapping.get(
            category.lower(),
            'quality-conscious consumers'
        )

        return {
            'summary': summary,
            'key_features': key_features,
            'best_for': best_for
        }


class ConversationalService:
    """
    Service for conversational shopping experience
    """

    @staticmethod
    async def process_message(
        message: str,
        context: Optional[Dict] = None
    ) -> Dict:
        """
        Process user message and generate response
        """
        message_lower = message.lower()

        # Intent detection
        intent = ConversationalService._detect_intent(message_lower)

        response = ""
        next_action = None
        recommended_products = None

        if intent == "search":
            response = "I'll help you find the perfect product. What are you looking for?"
            next_action = "search"
        elif intent == "recommendation":
            response = "Based on your interests, I have some great recommendations for you."
            next_action = "recommend"
        elif intent == "product_info":
            response = "I can help you learn more about our products. Which product interests you?"
            next_action = "info"
        elif intent == "help":
            response = "I'm here to help! You can search for products, get recommendations, or ask me questions about items."
            next_action = None
        else:
            response = "That sounds interesting! Would you like me to search for related products or get some recommendations?"
            next_action = "search"

        return {
            'response': response,
            'next_action': next_action,
            'intent': intent,
            'recommended_products': recommended_products
        }

    @staticmethod
    def _detect_intent(message: str) -> str:
        """Detect user intent from message"""
        if any(word in message for word in ['find', 'search', 'look', 'find']):
            return "search"
        elif any(word in message for word in ['recommend', 'suggest', 'best', 'like']):
            return "recommendation"
        elif any(word in message for word in ['about', 'info', 'details', 'tell', 'features']):
            return "product_info"
        elif any(word in message for word in ['help', 'how', 'what', 'can you', 'guide']):
            return "help"
        return "general"
