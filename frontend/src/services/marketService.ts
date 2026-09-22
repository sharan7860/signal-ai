import { apiRequest } from "./api";

export interface PricePoint {
  date: string;
  close: number;
}
export interface ForecastPoint {
  date: string;
  price: number;
  lower: number;
  upper: number;
}
export interface StockSummary {
  symbol: string;
  name: string;
  currency: string | null;
  current_price: number;
  change_percent: number;
  history: PricePoint[];
}
export interface DashboardData {
  quote: {
    symbol: string;
    company_name: string;
    currency: string | null;
    current_price: number;
    percentage_change: number | null;
    volume: number;
    market_cap: number | null;
    historical_closes: PricePoint[];
    timestamp: string;
  };
  indicators: {
    rsi: number | null;
    macd: number | null;
    macd_signal: number | null;
    macd_histogram: number | null;
    ma_20: number | null;
    ma_50: number | null;
    ma_200: number | null;
  };
  analysis: {
    summary: string;
    sentiment: string;
    recommendation: "BUY" | "HOLD" | "SELL";
    confidence_score: number;
    forecast: { method: string; note: string; predicted_prices: ForecastPoint[] } | null;
  };
}

export function getDashboard(symbol: string, signal?: AbortSignal) {
  return apiRequest<DashboardData>(`/stocks/dashboard/${encodeURIComponent(symbol)}`, { signal });
}

export function getWatchlist(signal?: AbortSignal) {
  return apiRequest<{ stocks: StockSummary[] }>("/stocks/compare/AAPL,MSFT,NVDA,SPY", { signal });
}

export function formatPrice(value: number, currency?: string | null) {
  if (!currency)
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
