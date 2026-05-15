
import requests

def test_alerts():
    url = "http://127.0.0.1:8000/alerts/"
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Total Alerts: {len(data.get('alerts', []))}")
            print(f"Unread Count: {data.get('unread_count')}")
            for a in data.get('alerts', [])[:2]:
                print(f"- {a['title']}: {a['message']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_alerts()
