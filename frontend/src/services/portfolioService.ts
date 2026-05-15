
export interface PortfolioMetric {
  value: number;
  max: number;
  description: string;
  status: string;
  percentage?: string;
}

export interface PortfolioAnalytics {
  portfolio_score: PortfolioMetric;
  risk_resilience: PortfolioMetric;
  alpha: PortfolioMetric;
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchPortfolioAnalytics(symbols: string[] = []): Promise<PortfolioAnalytics> {
  const symbolParam = symbols.join(",");
  const response = await fetch(`${API_BASE_URL}/portfolio/analytics?symbols=${symbolParam}`);
  
  if (!response.ok) {
    throw new Error(`Portfolio analytics fetch failed: ${response.statusText}`);
  }
  
  return response.json();
}
