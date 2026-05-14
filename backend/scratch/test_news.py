import yfinance as yf
import json
from datetime import datetime, timezone
from dateutil import parser as dateparser

def get_stock_news(symbol: str):
    symbol = symbol.upper()
    try:
        ticker = yf.Ticker(symbol)
        news = ticker.news
        if not news:
            print(f"No news for {symbol}")
            return []

        print(f"Fetched {len(news)} news items for {symbol}")
        # Print the first item to see structure
        if news:
            print("First item structure:")
            print(json.dumps(news[0], indent=2))

        formatted_news = []
        for item in news[:5]:
            content = item.get("content") or {}
            provider = item.get("provider") or {}
            canonical = content.get("canonicalUrl") or content.get("clickThroughUrl") or {}
            thumbnail_obj = content.get("thumbnail") or {}
            resolutions = thumbnail_obj.get("resolutions") or []
            thumb_url = resolutions[0].get("url") if resolutions else thumbnail_obj.get("originalUrl")

            pub_date = content.get("pubDate")
            pub_time = None
            if pub_date:
                try:
                    pub_time = int(dateparser.parse(pub_date).replace(tzinfo=timezone.utc).timestamp())
                except Exception as e:
                    print(f"Date parse error: {e}")
                    pub_time = None

            formatted_news.append({
                "id": content.get("id") or item.get("uuid"),
                "title": content.get("title") or item.get("title"),
                "publisher": provider.get("displayName") or item.get("publisher"),
                "link": canonical.get("url") or item.get("link"),
                "provider_publish_time": pub_time or item.get("providerPublishTime"),
                "symbol": symbol,
            })
        return formatted_news
    except Exception as e:
        print(f"Error for {symbol}: {e}")
        return []

if __name__ == "__main__":
    symbols = ["AAPL", "NVDA", "TSLA"]
    for s in symbols:
        res = get_stock_news(s)
        print(f"Formatted {len(res)} items for {s}")
