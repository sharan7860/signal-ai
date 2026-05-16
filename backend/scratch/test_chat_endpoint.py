
import httpx
import asyncio

async def test_chat():
    url = "http://localhost:8000/chat"
    payload = {"message": "Hello Jarvis"}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_chat())
