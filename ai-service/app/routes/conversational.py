"""
Conversational shopping routes
"""

from fastapi import APIRouter, HTTPException
from app.schemas.schemas import ConversationalRequest, ConversationalResponse
from app.services.ai_services import ConversationalService

router = APIRouter(prefix="/api", tags=["conversational"])


@router.post("/chat", response_model=ConversationalResponse)
async def conversational_chat(request: ConversationalRequest):
    """
    Handle conversational shopping messages
    """
    try:
        response_data = await ConversationalService.process_message(
            message=request.message,
            context=request.context
        )

        return ConversationalResponse(
            user_id=request.user_id,
            response=response_data['response'],
            next_action=response_data.get('next_action')
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
