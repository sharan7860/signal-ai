
import httpx
import logging
import os
from typing import List, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class ChatService:
    """Service for AI chat operations using OpenRouter"""
    
    API_KEY = settings.OPENROUTER_API_KEY
    API_URL = f"{settings.OPENROUTER_API_URL}/chat/completions"
    MODEL = "deepseek/deepseek-chat"
    
    SYSTEM_PROMPT = {
        "role": "system",
        "content": (
            "You are Jarvis, an advanced AI stock market analyst and financial copilot.\n\n"
            "You help users:\n"
            "- analyze stocks\n"
            "- understand technical indicators\n"
            "- evaluate risk\n"
            "- explain market sentiment\n"
            "- provide buy/sell/hold insights\n"
            "- summarize financial news\n"
            "- explain portfolio performance\n\n"
            "Always answer professionally, clearly, and concisely.\n\n"
            "Keep responses intelligent and finance-focused."
        )
    }

    @staticmethod
    async def get_ai_response(messages: List[Dict[str, str]]) -> str:
        """
        Fetch response from OpenRouter API
        """
        if not ChatService.API_KEY or ChatService.API_KEY == "your_openrouter_api_key_here" or not ChatService.API_KEY.strip():
            logger.error("Missing OpenRouter API Key")
            return "Jarvis is currently offline. Please configure the OpenRouter API Key in the backend .env file."

        # Ensure system prompt is present and correct
        formatted_messages = [ChatService.SYSTEM_PROMPT]
        
        # Add user/assistant messages, but avoid duplicating system prompt if frontend sent one
        for msg in messages:
            if msg.get("role") != "system":
                formatted_messages.append({
                    "role": msg.get("role"),
                    "content": msg.get("content")
                })

        payload = {
            "model": ChatService.MODEL,
            "messages": formatted_messages,
            "temperature": 0.3,
            "max_tokens": 1000,
        }

        headers = {
            "Authorization": f"Bearer {ChatService.API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8080", # Required by OpenRouter for some models
            "X-Title": "Trader AI"
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(ChatService.API_URL, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if not reply:
                    raise ValueError("Empty response from AI model")
                
                return reply.strip()
        except Exception as e:
            logger.error(f"OpenRouter API error: {str(e)}")
            return "I'm having trouble connecting to my neural network. Please check your OpenRouter API key or try again in a moment."
