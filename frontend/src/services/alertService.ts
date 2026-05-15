import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Alert {
  id: string;
  type: 'RSI' | 'MACD' | 'Sentiment' | 'Portfolio' | 'Risk' | 'Market' | 'Recommendation' | 'Prediction';
  symbol: string;
  severity: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: number;
}

export interface AlertResponse {
  alerts: Alert[];
  unread_count: int;
  timestamp: string;
}

export const alertService = {
  getAlerts: async (symbol?: string): Promise<AlertResponse> => {
    const url = symbol 
      ? `${API_BASE_URL}/alerts/?symbol=${symbol}`
      : `${API_BASE_URL}/alerts/`;
    const response = await axios.get(url);
    return response.data;
  },

  markAsRead: async (alertId: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/alerts/${alertId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axios.post(`${API_BASE_URL}/alerts/read-all`);
  }
};
