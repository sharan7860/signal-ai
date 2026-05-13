import yfinance as yf
import pandas as pd

def test_stock(symbol):
    print(f"Testing {symbol}...")
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="1mo")
    if hist.empty:
        print(f"No data for {symbol}")
    else:
        print(f"Data found for {symbol}")
        print(hist.tail())

if __name__ == "__main__":
    test_stock("AAPL")
    test_stock("NVDA")
