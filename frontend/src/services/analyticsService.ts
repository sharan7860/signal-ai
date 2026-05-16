const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://signal-ai-xci0.onrender.com";

export interface AnalyticsData {
  symbol: string;
  rsi: {
    value: number;
    status: string;
    description: string;
  };
  macd: {
    value: number;
    status: string;
    description: string;
  };
  moving_average: {
    signal: string;
    status: string;
    description: string;
  };
  sentiment: {
    value: number;
    status: string;
    sources: number;
  };
  tech_score: {
    value: number;
    status: string;
  };
  risk_score: {
    value: number;
    status: string;
    description: string;
  };
  timestamp: string;
}

export const fetchAnalytics = async (symbol: string): Promise<AnalyticsData> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics for ${symbol}`);
  }
  return response.json();
};
