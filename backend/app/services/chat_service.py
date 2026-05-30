
import httpx
import logging
import os
from typing import List, Dict, Any
import re
from app.config import settings
from app.services.stock_service import StockService

logger = logging.getLogger(__name__)

class ChatService:
    """Service for AI chat operations using OpenRouter"""
    
    API_KEY = settings.OPENROUTER_API_KEY
    API_URL = f"{settings.OPENROUTER_API_URL}/chat/completions"
    MODEL = "openrouter/free"
    
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
                
                if response.status_code != 200:
                    logger.error(f"OpenRouter API returned {response.status_code}: {response.text[:500]}")
                
                response.raise_for_status()
                data = response.json()
                
                reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if not reply:
                    raise ValueError("Empty response from AI model")
                
                return reply.strip()
        except httpx.HTTPStatusError as e:
            logger.error(f"OpenRouter HTTP error {e.response.status_code}: {e.response.text[:500]}")
            return await ChatService.get_local_fallback_response(messages)
        except Exception as e:
            logger.error(f"OpenRouter API error: {str(e)}")
            # Fallback to Local Brain if API fails
            return await ChatService.get_local_fallback_response(messages)

    @staticmethod
    async def get_local_fallback_response(messages: List[Dict[str, str]]) -> str:
        """
        Premium local fallback that uses real stock data to answer financial queries
        when the external AI is unavailable.
        """
        # Get the last user message
        user_query = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                user_query = msg.get("content", "")
                break
        
        if not user_query:
            return "Jarvis is standing by. How can I assist your market analysis today?"

        # 1. Look for stock tickers (e.g. NVDA, TSLA, AAPL)
        symbols = re.findall(r'\b[A-Z]{2,5}\b', user_query.upper())
        
        # Also check for common names
        names_map = {"TESLA": "TSLA", "NVIDIA": "NVDA", "APPLE": "AAPL", "MICROSOFT": "MSFT", "AMAZON": "AMZN", "GOOGLE": "GOOGL", "BITCOIN": "BTC-USD"}
        for name, sym in names_map.items():
            if name in user_query.upper():
                symbols.append(sym)
        
        symbols = list(set(symbols)) # Unique

        if symbols:
            target = symbols[0]
            try:
                # Fetch real analytics from our StockService
                analytics = StockService.get_ai_analytics(target)
                quote = StockService.get_stock_quote(target)
                
                name = quote.get("company_name", target)
                price = quote.get("current_price", 0)
                change = quote.get("percentage_change", 0)
                sentiment = analytics.get("sentiment", {}).get("status", "Neutral")
                explanation = analytics.get("explanation", "")
                tech_score = analytics.get("tech_score", {}).get("value", 5.0)

                response = (
                    f"I've initialized a neural scan for **{name} ({target})**.\n\n"
                    f"Currently trading at **${price:,.2f}** ({'+' if change >= 0 else ''}{change}%).\n"
                    f"My technical consensus is **{sentiment}** with a neural score of **{tech_score}/10**.\n\n"
                    f"**Analysis:** {explanation}\n\n"
                    f"I am currently operating in **Local Intelligence Mode** as my cloud neural link is being recalibrated, but I have full access to real-time market data."
                )
                return response
            except Exception as e:
                logger.error(f"Local fallback failure for {target}: {str(e)}")
        
        # General non-stock responses
        if any(word in user_query.lower() for word in ["hello", "hi", "hey", "who"]):
            return "I am Jarvis, your neural financial copilot. I analyze market signals and technical patterns to optimize your trading strategy. My cloud link is currently offline, but I can still provide deep analytics for any specific ticker you mention."
            
        if any(word in user_query.lower() for word in ["market", "how", "status"]):
            return "The market is currently showing complex volatility patterns. Mention a specific ticker (e.g., 'NVDA' or 'TSLA') and I will run a local technical deep-dive for you."

        return "I'm currently running on local backup processors. Please mention a stock ticker (like AAPL or NVDA) and I'll provide a real-time technical analysis for you."
