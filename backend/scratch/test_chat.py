
import requests

def test_chat():
    url = "http://localhost:8000/chat"
    payload = {
        "message": "Hello Jarvis, can you analyze NVIDIA stock?"
    }
    
    print(f"Testing {url}...")
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json().get('reply')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed to connect: {str(e)}")

if __name__ == "__main__":
    test_chat()
