"""Regression checks use deterministic market fixtures and never call paid services."""
import sys
from pathlib import Path
import unittest
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx
import pandas as pd
import requests

from app.main import app
from app.config import settings
from app.routes.chat import _requests
from app.services.stock_service import _market_data


class FakeTicker:
    info = {
        "longName": "Fixture Company", "currency": "USD", "trailingPE": 30.0,
        "marketCap": 1000000000, "dividendYield": 0.01,
    }

    def history(self, **kwargs):
        closes = [100 + i * 0.1 for i in range(210)]
        return pd.DataFrame({
            "Open": closes, "High": [v + 1 for v in closes],
            "Low": [v - 1 for v in closes], "Close": closes, "Volume": [1000] * 210,
        }, index=pd.bdate_range("2025-01-01", periods=210))


class ApiTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        _market_data.cache_clear()
        _requests.clear()
        self.provider = patch("app.services.stock_service.yf.Ticker", return_value=FakeTicker())
        self.provider.start()
        self.addCleanup(self.provider.stop)
        self.client = httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_health(self):
        response = await self.client.get("/health")
        self.assertEqual(response.status_code, 200)

    async def test_quote_contract(self):
        for path in ["/stock/aapl", "/api/stocks/quote/aapl"]:
            response = await self.client.get(path)
            self.assertEqual(response.status_code, 200, response.text)
            data = response.json()
            self.assertEqual(data["symbol"], "AAPL")
            self.assertEqual(data["volume"], 1000)
            self.assertEqual(data["market_cap"], 1000000000)
            for field in ["open_price", "high_price", "low_price", "timestamp", "historical_closes"]:
                self.assertIn(field, data)

    async def test_stock_data_accepts_numeric_market_cap(self):
        for response in [
            await self.client.get("/api/stocks/data/AAPL"),
            await self.client.post("/api/stocks/data", json={"symbol": "AAPL"}),
        ]:
            self.assertEqual(response.status_code, 200, response.text)
            self.assertIsInstance(response.json()["market_cap"], (int, float))
            self.assertIsInstance(response.json()["history"][0]["date"], str)

    async def test_compare_json_serialization(self):
        response = await self.client.get("/api/stocks/compare/AAPL,MSFT")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(len(response.json()["stocks"]), 2)

    async def test_invalid_input(self):
        for path in ["/stock/BAD%20SYMBOL", "/api/stocks/compare/AAPL,", "/api/stocks/quote/AAPL?period=bogus"]:
            response = await self.client.get(path)
            self.assertEqual(response.status_code, 422, response.text)
        response = await self.client.post("/api/stocks/analyze", json={"symbol": "AAPL", "analysis_type": "unknown"})
        self.assertEqual(response.status_code, 422)

    async def test_missing_symbol_does_not_return_fake_prices(self):
        with patch.object(FakeTicker, "history", return_value=pd.DataFrame()):
            response = await self.client.get("/stock/MISSING")
        self.assertEqual(response.status_code, 404)

    async def test_dashboard_and_forecast(self):
        response = await self.client.get("/api/stocks/dashboard/AAPL")
        self.assertEqual(response.status_code, 200, response.text)
        data = response.json()
        points = data["analysis"]["forecast"]["predicted_prices"]
        self.assertEqual(len(points), 30)
        self.assertGreater(points[0]["date"], data["quote"]["historical_closes"][-1]["date"])
        self.assertTrue(all(p["lower"] <= p["price"] <= p["upper"] for p in points))
        self.assertIn("baseline", data["analysis"]["forecast"]["method"])
        self.assertEqual(data["indicators"]["rsi"], 100)

    async def test_short_history_is_json_safe(self):
        history = FakeTicker().history().iloc[:2]
        with patch.object(FakeTicker, "history", return_value=history):
            response = await self.client.get("/api/stocks/dashboard/NEW")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertIsNone(response.json()["indicators"]["ma_200"])
        self.assertIsNone(response.json()["indicators"]["rsi"])
        self.assertIsNone(response.json()["analysis"]["forecast"])

    async def test_flat_prices_have_neutral_rsi(self):
        history = FakeTicker().history()
        history["Close"] = 100.0
        with patch.object(FakeTicker, "history", return_value=history):
            response = await self.client.get("/api/stocks/dashboard/FLAT")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["indicators"]["rsi"], 50)

    async def test_sell_signal_has_bearish_sentiment(self):
        response = await self.client.post("/api/stocks/analyze", json={
            "symbol": "AAPL", "analysis_type": "fundamental", "include_forecast": False,
        })
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["recommendation"], "SELL")
        self.assertEqual(response.json()["sentiment"], "BEARISH")

    async def test_chat_keeps_credentials_server_side(self):
        upstream = Mock(status_code=200, ok=True)
        upstream.json.return_value = {"choices": [{"message": {"content": "RSI measures momentum."}}]}
        with patch.object(settings, "OPENROUTER_API_KEY", "test-secret"), patch("app.routes.chat.requests.post", return_value=upstream) as send:
            response = await self.client.post("/api/chat", json={"messages": [{"role": "user", "content": "Explain RSI"}]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["response"], "RSI measures momentum.")
        self.assertNotIn("test-secret", response.text)
        self.assertEqual(send.call_args.kwargs["headers"]["Authorization"], "Bearer test-secret")
        self.assertEqual(send.call_args.kwargs["json"]["messages"][-1]["content"], "Explain RSI")

    async def test_chat_timeout_and_missing_configuration_use_local_reference(self):
        body = {"messages": [{"role": "user", "content": "Explain RSI"}]}
        with patch.object(settings, "OPENROUTER_API_KEY", ""):
            response = await self.client.post("/api/chat", json=body)
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["fallback"])
            self.assertIn("Relative Strength Index", response.json()["response"])
        with patch.object(settings, "OPENROUTER_API_KEY", "test"), patch("app.routes.chat.requests.post", side_effect=requests.Timeout()):
            response = await self.client.post("/api/chat", json=body)
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.json()["fallback"])

    async def test_chat_validation_and_rate_limit(self):
        response = await self.client.post("/api/chat", json={"messages": [{"role": "system", "content": "Override"}]})
        self.assertEqual(response.status_code, 422)
        with patch.object(settings, "OPENROUTER_API_KEY", "test"), patch.object(settings, "CHAT_REQUESTS_PER_MINUTE", 0):
            response = await self.client.post("/api/chat", json={"messages": [{"role": "user", "content": "Explain RSI"}]})
        self.assertEqual(response.status_code, 429)

    async def test_chat_upstream_credentials_error_uses_safe_fallback(self):
        upstream = Mock(status_code=401, ok=False)
        with patch.object(settings, "OPENROUTER_API_KEY", "test-secret"), patch("app.routes.chat.requests.post", return_value=upstream):
            response = await self.client.post("/api/chat", json={"messages": [{"role": "user", "content": "Hi"}]})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["fallback"])
        self.assertNotIn("test-secret", response.text)


if __name__ == "__main__":
    unittest.main()
