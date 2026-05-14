
import httpx
import asyncio

async def test():
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {"Authorization": "Bearer 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"}
    payload = {
        "model": "deepseek/deepseek-chat",
        "messages": [{"role": "user", "content": "hi"}]
    }
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers=headers)
            print(f"Status: {resp.status_code}")
            print(f"Body: {resp.text[:100]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
