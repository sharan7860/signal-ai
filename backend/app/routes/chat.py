
from fastapi import APIRouter, HTTPException, Body
from app.services.chat_service import ChatService
from pydantic import BaseModel
from typing import List, Dict, Optional

router = APIRouter(tags=["Chat"])

class ChatRequest(BaseModel):
    message: Optional[str] = None
    messages: Optional[List[Dict[str, str]]] = None

@router.post("/chat")
async def chat_endpoint(request: ChatRequest = Body(...)):
    """
    Unified chat endpoint for Jarvis AI Assistant.
    Supports single message or full history.
    """
    try:
        # Handle both single message and full history for flexibility
        messages = request.messages if request.messages else []
        if request.message and not messages:
            messages = [{"role": "user", "content": request.message}]
        
        if not messages:
            raise HTTPException(status_code=400, detail="No message provided")
            
        reply = await ChatService.get_ai_response(messages)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
