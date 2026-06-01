from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Test health endpoint
print("Testing /health endpoint...")
response = client.get("/health")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Test trending stocks endpoint
print("\nTesting /api/stocks/trending endpoint...")
response = client.get("/api/stocks/trending")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
