"""
Stock data service for fetching and caching stock information
"""
import yfinance as yf
import pandas as pd
from datetime import datetime
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class StockService:
    """Service for stock data operations"""

    @staticmethod
    def get_stock_data(symbol: str, period: str = "1y", interval: str = "1d") -> Dict[str, Any]:
        """
        Fetch stock data using yfinance

        Args:
            symbol: Stock ticker symbol
            period: Data period
            interval: Data interval

        Returns:
            Dictionary with stock data
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            info = ticker.info

            return {
                "symbol": symbol,
                "name": info.get("longName", ""),
                "current_price": info.get("currentPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "change_percent": info.get("regularMarketChangePercent", 0),
                "pe_ratio": info.get("trailingPE", None),
                "market_cap": info.get("marketCap", None),
                "dividend_yield": info.get("dividendYield", None),
                "history": hist.to_dict(),
                "timestamp": datetime.utcnow(),
            }
        except Exception as e:
            logger.error(f"Error fetching stock data for {symbol}: {str(e)}")
            raise

    @staticmethod
    def get_multiple_stocks(symbols: list) -> list:
        """
        Fetch data for multiple stocks

        Args:
            symbols: List of stock symbols

        Returns:
            List of stock data dictionaries
        """
        results = []
        for symbol in symbols:
            try:
                data = StockService.get_stock_data(symbol)
                results.append(data)
            except Exception as e:
                logger.error(f"Failed to fetch {symbol}: {str(e)}")
        return results

    @staticmethod
    def get_stock_quote(symbol: str, period: str = "3mo") -> Dict[str, Any]:
        """
        Fetch comprehensive stock quote with historical close prices

        Args:
            symbol: Stock ticker symbol (e.g., AAPL)
            period: Historical data period (default: 3 months)

        Returns:
            Dictionary with current quote and historical closes
        """
        try:
            ticker = yf.Ticker(symbol)

            # Get historical data
            hist = ticker.history(period=period)

            if hist.empty:
                raise ValueError(f"No data available for symbol {symbol}")

            # Get info for current price and other details
            info = ticker.info

            # Get latest day's data
            latest = hist.iloc[-1]

            # Convert historical closes to list of dicts with dates
            historical_closes = [
                {"date": date.strftime("%Y-%m-%d"), "close": row["Close"]}
                for date, row in hist.iterrows()
            ]

            return {
                "symbol": symbol,
                "current_price": latest["Close"],
                "open": latest["Open"],
                "high": latest["High"],
                "low": latest["Low"],
                "volume": latest["Volume"],
                "market_cap": info.get("marketCap"),
                "company_name": info.get("longName"),
                "sector": info.get("sector"),
                "currency": info.get("currency"),
                "percentage_change": info.get("regularMarketChangePercent"),
                "previous_close": info.get("regularMarketPreviousClose"),
                "historical_prices": historical_closes,
                "timestamps": [date.strftime("%Y-%m-%d") for date in hist.index],
            }
        except Exception as e:
            logger.error(f"Error fetching stock data for {symbol}: {str(e)}")
            raise ValueError("Failed to fetch stock data")

    @staticmethod
    def calculate_technical_indicators(symbol: str) -> Dict[str, Any]:
        """
        Calculate technical indicators for a stock

        Args:
            symbol: Stock ticker symbol

        Returns:
            Dictionary with technical indicators
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1y")

            # Calculate moving averages
            ma_20 = hist["Close"].rolling(window=20).mean().iloc[-1]
            ma_50 = hist["Close"].rolling(window=50).mean().iloc[-1]
            ma_200 = hist["Close"].rolling(window=200).mean().iloc[-1]

            # Calculate RSI
            delta = hist["Close"].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))

            # Calculate MACD
            exp1 = hist["Close"].ewm(span=12, adjust=False).mean()
            exp2 = hist["Close"].ewm(span=26, adjust=False).mean()
            macd = exp1 - exp2
            signal = macd.ewm(span=9, adjust=False).mean()
            histogram = macd - signal

            current_price = hist["Close"].iloc[-1]

            return {
                "symbol": symbol,
                "current_price": current_price,
                "ma_20": float(ma_20),
                "ma_50": float(ma_50),
                "ma_200": float(ma_200),
                "rsi": float(rsi.iloc[-1]) if len(rsi) > 0 else None,
                "macd": float(macd.iloc[-1]) if len(macd) > 0 else None,
                "macd_signal": float(signal.iloc[-1]) if len(signal) > 0 else None,
                "macd_histogram": float(histogram.iloc[-1]) if len(histogram) > 0 else None,
                "timestamp": datetime.utcnow(),
            }
        except Exception as e:
            logger.error(f"Error calculating indicators for {symbol}: {str(e)}")
            raise
