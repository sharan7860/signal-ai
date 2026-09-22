import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { MarketContext } from "@/hooks/use-market";
import { getDashboard } from "@/services/marketService";

export function MarketProvider({ children }: { children: ReactNode }) {
  const [symbol, setSymbol] = useState("NVDA");
  const query = useQuery({
    queryKey: ["dashboard", symbol],
    queryFn: ({ signal }) => getDashboard(symbol, signal),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return (
    <MarketContext.Provider
      value={{
        symbol,
        selectSymbol: setSymbol,
        data: query.data,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error: query.error,
        refresh: () => {
          void query.refetch();
        },
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}
