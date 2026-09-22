"""Transparent indicator rules and a historical-return projection baseline."""
from datetime import datetime, timezone
import math

import numpy as np
import pandas as pd


def analysis_result(symbol, kind, signals, votes):
    direction = sum(votes)
    recommendation = "BUY" if direction > 0 else "SELL" if direction < 0 else "HOLD"
    # Signal agreement describes these rules, not a calibrated win probability.
    agreement = abs(direction) / len(votes) if votes else 0.0
    return {
        "symbol": symbol.upper(), "analysis_type": kind,
        "summary": " | ".join(signals) or "Insufficient data for analysis",
        "sentiment": {"BUY": "BULLISH", "SELL": "BEARISH", "HOLD": "NEUTRAL"}[recommendation],
        "recommendation": recommendation, "confidence_score": agreement,
        "timestamp": datetime.now(timezone.utc),
    }


class AIAnalysisService:
    @staticmethod
    def analyze_technical(symbol, indicators):
        signals, votes = [], []
        rsi = indicators.get("rsi")
        if rsi is not None:
            votes.append(1 if rsi < 30 else -1 if rsi > 70 else 0)
            signals.append(f"RSI {rsi:.1f}: " + ("oversold" if rsi < 30 else "overbought" if rsi > 70 else "neutral"))
        macd = indicators.get("macd_histogram")
        if macd is not None:
            votes.append(1 if macd > 0 else -1 if macd < 0 else 0)
            signals.append("MACD: " + ("bullish" if macd > 0 else "bearish" if macd < 0 else "neutral"))
        price, ma20, ma50 = (indicators.get(key) for key in ("current_price", "ma_20", "ma_50"))
        if all(value is not None for value in (price, ma20, ma50)):
            vote = 1 if price > ma20 > ma50 else -1 if price < ma20 < ma50 else 0
            votes.append(vote)
            signals.append("Moving averages: " + ("uptrend" if vote > 0 else "downtrend" if vote < 0 else "mixed"))
        return analysis_result(symbol, "technical", signals, votes)

    @staticmethod
    def analyze_fundamental(symbol, stock_info):
        pe = stock_info.get("pe_ratio")
        if pe is None or pe <= 0:
            return analysis_result(symbol, "fundamental", ["Positive P/E unavailable; valuation rule cannot be applied"], [])
        vote = 1 if pe < 15 else -1 if pe > 25 else 0
        signals = [f"P/E {pe:.1f}: " + ("below 15" if vote > 0 else "above 25" if vote < 0 else "between 15 and 25")]
        return analysis_result(symbol, "fundamental", signals, [vote])

    @staticmethod
    def generate_forecast(symbol, historical_data):
        history = historical_data.get("history", [])
        closes = np.asarray([point["close"] for point in history[-61:]], dtype=float)
        if len(closes) < 20 or not np.isfinite(closes).all() or (closes <= 0).any():
            return None
        returns = np.diff(np.log(closes))
        drift = float(returns.mean())
        volatility = float(returns.std(ddof=1))
        last_date = pd.Timestamp(history[-1]["date"])
        dates = pd.bdate_range(last_date + pd.offsets.BDay(1), periods=30)
        points = []
        for day, date in enumerate(dates, 1):
            center = math.log(float(closes[-1])) + drift * day
            spread = 1.96 * volatility * math.sqrt(day)
            points.append({"date": date.strftime("%Y-%m-%d"),
                           "price": round(math.exp(min(center, 50)), 2),
                           "lower": round(math.exp(min(center - spread, 50)), 2),
                           "upper": round(math.exp(min(center + spread, 50)), 2)})
        return {
            "symbol": symbol.upper(), "forecast_period": "30_weekdays",
            "method": "Historical log-return baseline; not a trained AI model",
            "note": "Illustrative projection using recent drift and volatility. Bands are model assumptions, not validated accuracy. Dates exclude weekends but not exchange holidays.",
            "predicted_prices": points,
            "confidence_interval": [points[-1]["lower"], points[-1]["upper"]],
            "timestamp": datetime.now(timezone.utc),
        }
