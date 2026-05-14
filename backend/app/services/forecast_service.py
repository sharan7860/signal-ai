"""
Forecast service for stock price prediction using ARIMA
"""
import pandas as pd
import yfinance as yf
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller
from datetime import datetime, timedelta
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class ForecastService:
    """Service for generating stock price forecasts"""

    @staticmethod
    def get_arima_forecast(
        symbol: str, 
        days: int = 30, 
        p: int = 2, 
        d: int = 1, 
        q: int = 2
    ) -> Dict[str, Any]:
        """
        Generate ARIMA forecast for a given stock symbol
        """
        try:
            # Fetch historical data
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="2y")
            
            if data.empty:
                raise ValueError(f"No data found for symbol {symbol}")

            # Fit ARIMA model
            model = ARIMA(data['Close'], order=(p, d, q))
            model_fit = model.fit()
            
            # Forecast with confidence intervals if possible
            # ARIMA forecast returns a series. For confidence intervals, we'd need get_forecast
            forecast_res = model_fit.get_forecast(steps=days)
            forecast = forecast_res.predicted_mean
            conf_int = forecast_res.conf_int()
            
            # Generate future dates (business days)
            future_dates = pd.date_range(
                start=data.index[-1],
                periods=days + 1,
                freq='B'
            )[1:]

            forecast_data = [
                {
                    "date": date.strftime("%Y-%m-%d"), 
                    "forecast": float(val),
                    "lower": float(low),
                    "upper": float(high)
                }
                for date, val, low, high in zip(future_dates, forecast, conf_int.iloc[:, 0], conf_int.iloc[:, 1])
            ]

            # Also get some historical data for context
            historical_data = [
                {"date": date.strftime("%Y-%m-%d"), "close": float(row["Close"])}
                for date, row in data.tail(60).iterrows()
            ]

            return {
                "symbol": symbol,
                "forecast": forecast_data,
                "history": historical_data,
                "last_price": float(data['Close'].iloc[-1]),
                "timestamp": datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error generating ARIMA forecast for {symbol}: {str(e)}")
            raise

    @staticmethod
    def get_analytics(symbol: str) -> Dict[str, Any]:
        """
        Perform ADF stationarity test and Seasonal Decomposition
        """
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1y")
            
            if data.empty:
                raise ValueError(f"No data found for symbol {symbol}")

            # ADF Test
            adf_result = adfuller(data['Close'].dropna())
            adf_stats = {
                "statistic": float(adf_result[0]),
                "p_value": float(adf_result[1]),
                "is_stationary": bool(adf_result[1] < 0.05)
            }

            # Seasonal Decomposition
            # Use period=30 as in temp-ai
            decomposition = seasonal_decompose(
                data['Close'],
                model='multiplicative',
                period=30
            )

            decomp_data = {
                "dates": [d.strftime("%Y-%m-%d") for d in data.index],
                "observed": [float(x) for x in decomposition.observed.fillna(0)],
                "trend": [float(x) for x in decomposition.trend.fillna(0)],
                "seasonal": [float(x) for x in decomposition.seasonal.fillna(0)],
                "residual": [float(x) for x in decomposition.resid.fillna(0)]
            }

            return {
                "symbol": symbol,
                "adf_test": adf_stats,
                "decomposition": decomp_data,
                "timestamp": datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error performing analytics for {symbol}: {str(e)}")
            raise
