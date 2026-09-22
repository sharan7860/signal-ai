import { createContext, useContext } from "react";
import type { DashboardData } from "@/services/marketService";

export interface MarketState {
  symbol: string;
  selectSymbol: (symbol: string) => void;
  data: DashboardData | undefined;
  isPending: boolean;
  isFetching: boolean;
  error: Error | null;
  refresh: () => void;
}
export const MarketContext = createContext<MarketState | null>(null);
export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) throw new Error("Market components need a MarketProvider");
  return context;
}
