const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface StockQuote {
  symbol: string;
  current_price: number;
  open_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  historical_closes: { date: string; close: number }[];
  timestamp: string;
  percentage_change: number;
  company_name: string;
}

export const fetchStockQuote = async (symbol: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/stock/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for ${symbol}`);
  }
  return response.json();
};

export const fetchMultipleStocks = async (symbols: string[]): Promise<any[]> => {
  // The backend has a compare endpoint or we can fetch individually
  // Let's fetch individually for now as the quote endpoint is more detailed
  const promises = symbols.map(s => fetchStockQuote(s));
  return Promise.all(promises);
};
