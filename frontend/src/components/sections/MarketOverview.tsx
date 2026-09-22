import { useQuery } from "@tanstack/react-query";
import { AnimatedSparkline } from "../AnimatedSparkline";
import { useMarket } from "@/hooks/use-market";
import { getWatchlist } from "@/services/marketService";

export function MarketOverview() {
  const { selectSymbol } = useMarket();
  const query = useQuery({
    queryKey: ["watchlist"],
    queryFn: ({ signal }) => getWatchlist(signal),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-electric">
          Market overview · Quotes may be delayed
        </p>
        <h2 className="font-display text-4xl font-semibold">Follow the market</h2>
        {query.isPending && (
          <p role="status" className="mt-6 text-muted-foreground">
            Loading the watchlist…
          </p>
        )}
        {query.error && (
          <div role="alert" className="mt-6 text-muted-foreground">
            <p>{query.error.message}</p>
            <button onClick={() => void query.refetch()} className="mt-2 text-electric underline">
              Retry watchlist
            </button>
          </div>
        )}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {query.data?.stocks.map((stock) => (
            <button
              key={stock.symbol}
              className="glass-card rounded-2xl p-5 text-left transition hover:-translate-y-1"
              onClick={() => {
                selectSymbol(stock.symbol);
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-display text-lg">{stock.symbol}</h3>
                <span
                  className={stock.change_percent >= 0 ? "text-emerald-trend" : "text-red-trend"}
                >
                  {stock.change_percent >= 0 ? "+" : ""}
                  {stock.change_percent.toFixed(2)}%
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {stock.current_price.toFixed(2)} {stock.currency ?? ""}
              </p>
              <div className="mt-4 h-14">
                <AnimatedSparkline
                  data={stock.history.slice(-30).map((point) => point.close)}
                  color={stock.change_percent >= 0 ? "var(--emerald-trend)" : "var(--red-trend)"}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                As of {stock.history.at(-1)?.date}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
