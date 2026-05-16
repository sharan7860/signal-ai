const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://signal-ai-xci0.onrender.com";

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
export const fetchStockForecast = async (symbol: string, days: number = 30): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/forecast/${symbol}?days=${days}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch forecast for ${symbol}`);
  }
  return response.json();
};

export const fetchStockAnalytics = async (symbol: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/forecast/${symbol}/analytics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics for ${symbol}`);
  }
  return response.json();
};
export const fetchBatchInfo = async (symbols: string[]): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/stocks/info/${symbols.join(",")}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock info for ${symbols}`);
  }
  return response.json();
};

export const fetchWatchlistNews = async (symbols: string[]): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/stocks/news/${symbols.join(",")}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock news for ${symbols}`);
  }
  return response.json();
};
export const fetchTrendingStocks = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/stocks/trending`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trending stocks`);
  }
  const data = await response.json();
  return data.stocks || [];
};
