import logging
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

from app.models.alert_model import Alert
from app.services.stock_service import StockService
from app.services.ai_service import AIAnalysisService

logger = logging.getLogger(__name__)

class AlertService:
    """Service for generating and managing AI-powered alerts"""
    
    # In-memory storage for demo purposes
    _alerts_cache = []
    _read_ids = set()
    _last_generated = None

    @staticmethod
    async def get_all_alerts(symbol: str = None) -> List[Alert]:
        """
        Fetch or generate live alerts for market monitoring.
        """
        # Refresh alerts if they are older than 30 seconds or cache is empty
        now = datetime.utcnow()
        if not AlertService._alerts_cache or not AlertService._last_generated or (now - AlertService._last_generated) > timedelta(seconds=30):
            await AlertService.generate_live_alerts()
            
        alerts = AlertService._alerts_cache
        
        if symbol:
            alerts = [a for a in alerts if a.symbol.upper() == symbol.upper()]
            
        return alerts

    @staticmethod
    async def generate_live_alerts():
        """
        Simulate real-time monitoring of indicators and generate alerts based on triggers.
        """
        try:
            new_alerts = []
            monitored_symbols = ["NVDA", "AAPL", "TSLA", "MSFT", "BTC-USD"]
            
            for symbol in monitored_symbols:
                # 1. Technical Indicators (RSI/MACD)
                try:
                    indicators = StockService.calculate_technical_indicators(symbol)
                    rsi = indicators.get("rsi", 50)
                    
                    if rsi < 30:
                        new_alerts.append(Alert(
                            id=str(uuid.uuid4()),
                            type="RSI",
                            symbol=symbol,
                            severity="warning",
                            title="Oversold Signal",
                            message=f"{symbol} RSI dropped below 30 ({round(rsi, 1)}). Potential bounce imminent.",
                            timestamp=datetime.utcnow(),
                            priority=4
                        ))
                    elif rsi > 70:
                        new_alerts.append(Alert(
                            id=str(uuid.uuid4()),
                            type="RSI",
                            symbol=symbol,
                            severity="danger",
                            title="Overbought Warning",
                            message=f"{symbol} RSI is above 70 ({round(rsi, 1)}). Risk of correction.",
                            timestamp=datetime.utcnow(),
                            priority=4
                        ))

                    # MACD Crossover logic
                    macd_hist = indicators.get("macd_histogram", 0)
                    if macd_hist > 0 and random.random() > 0.8: # Simulate a recent cross
                        new_alerts.append(Alert(
                            id=str(uuid.uuid4()),
                            type="MACD",
                            symbol=symbol,
                            severity="success",
                            title="Bullish Crossover",
                            message=f"{symbol} MACD histogram turned positive. Upward momentum building.",
                            timestamp=datetime.utcnow(),
                            priority=3
                        ))
                except Exception as e:
                    logger.warning(f"Failed to generate technical alerts for {symbol}: {e}")

                # 2. Recommendation Changes
                if random.random() > 0.7:
                    recs = ["BUY", "HOLD", "SELL"]
                    new_rec = random.choice(recs)
                    new_alerts.append(Alert(
                        id=str(uuid.uuid4()),
                        type="Recommendation",
                        symbol=symbol,
                        severity="info" if new_rec == "HOLD" else "success" if new_rec == "BUY" else "danger",
                        title="AI Rating Update",
                        message=f"Jarvis AI updated {symbol} rating to {new_rec}.",
                        timestamp=datetime.utcnow(),
                        priority=5
                    ))

            # 3. Portfolio & Market Alerts
            if random.random() > 0.5:
                new_alerts.append(Alert(
                    id=str(uuid.uuid4()),
                    type="Market",
                    symbol="NASDAQ",
                    severity="info",
                    title="Market Sentiment Shift",
                    message="Institutional flow detected moving into semi-conductors.",
                    timestamp=datetime.utcnow(),
                    priority=2
                ))

            if random.random() > 0.8:
                new_alerts.append(Alert(
                    id=str(uuid.uuid4()),
                    type="Portfolio",
                    symbol="USER",
                    severity="warning",
                    title="Concentration Risk",
                    message="Technology sector allocation exceeds 60% threshold.",
                    timestamp=datetime.utcnow(),
                    priority=3
                ))

            # Update cache: keep some old ones to simulate history but add fresh ones
            # For this demo, we'll keep up to 15 latest alerts
            combined = new_alerts + AlertService._alerts_cache
            combined.sort(key=lambda x: x.timestamp, reverse=True)
            # Ensure we always have at least one alert for demo/initial view
            if not combined:
                combined.append(Alert(
                    id="sys-001",
                    symbol="SYSTEM",
                    title="AI Engine Online",
                    message="Alert Center is active and monitoring 50+ tickers for technical breakouts.",
                    severity="info",
                    timestamp=datetime.utcnow()
                ))

            AlertService._alerts_cache = combined[:15]
            AlertService._last_generated = datetime.utcnow()
            
        except Exception as e:
            logger.error(f"Error generating alerts: {e}")

    @staticmethod
    def mark_as_read(alert_id: str):
        for alert in AlertService._alerts_cache:
            if alert.id == alert_id:
                alert.read = True
                break

    @staticmethod
    def mark_all_as_read():
        for alert in AlertService._alerts_cache:
            alert.read = True
