import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/services/api";
import { formatPrice, type StockSummary } from "@/services/marketService";

interface Holding {
  symbol: string;
  shares: number;
}
const STORAGE_KEY = "trader-ai-portfolio-v1";

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [ready, setReady] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [storageWarning, setStorageWarning] = useState("");

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        const valid = saved.filter(
          (holding): holding is Holding =>
            holding &&
            typeof holding.symbol === "string" &&
            /^[A-Z0-9.^=-]{1,20}$/.test(holding.symbol) &&
            typeof holding.shares === "number" &&
            Number.isFinite(holding.shares) &&
            holding.shares > 0 &&
            holding.shares <= 1e12,
        );
        setHoldings(
          Array.from(new Map(valid.map((item) => [item.symbol, item])).values()).slice(0, 20),
        );
      }
    } catch {
      setStorageWarning(
        "Browser storage is unavailable. Holdings will last only until you leave this page.",
      );
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    } catch {
      setStorageWarning("Your holdings could not be saved in this browser.");
    }
  }, [holdings, ready]);

  const symbols = holdings.map((holding) => holding.symbol).join(",");
  const query = useQuery({
    queryKey: ["portfolio-quotes", symbols],
    queryFn: ({ signal }) =>
      apiRequest<{ stocks: StockSummary[] }>(`/stocks/compare/${encodeURIComponent(symbols)}`, {
        signal,
      }),
    enabled: ready && holdings.length > 0,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const rows = holdings.map((holding) => ({
    ...holding,
    quote: query.data?.stocks.find((stock) => stock.symbol === holding.symbol),
  }));
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.quote) {
      const currency = row.quote.currency ?? "Unknown currency";
      totals.set(currency, (totals.get(currency) ?? 0) + row.shares * row.quote.current_price);
    }
  }

  const addHolding = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    const ticker = symbol.trim().toUpperCase();
    const count = Number(shares);
    if (
      !/^[A-Z0-9.^=-]{1,20}$/.test(ticker) ||
      !Number.isFinite(count) ||
      count <= 0 ||
      count > 1e12
    ) {
      setError("Enter a valid ticker and a positive share quantity.");
      return;
    }
    if (holdings.length >= 20 && !holdings.some((holding) => holding.symbol === ticker)) {
      setError("You can track up to 20 tickers.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiRequest<StockSummary>(`/stocks/data/${encodeURIComponent(ticker)}`);
      setHoldings((previous) => [
        ...previous.filter((holding) => holding.symbol !== ticker),
        { symbol: ticker, shares: count },
      ]);
      setSymbol("");
      setShares("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add this holding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="portfolio" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-electric">Portfolio tracker</p>
        <h2 className="font-display text-4xl font-semibold">
          Your holdings. <span className="text-gradient">Current valuations.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Manually tracked holdings saved in this browser. No brokerage connection. Adding a ticker
          again replaces its quantity.
        </p>
        <form
          onSubmit={addHolding}
          className="glass-card mt-8 flex flex-wrap items-end gap-4 rounded-2xl p-6"
        >
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
            Portfolio ticker
            <input
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              placeholder="AAPL"
              maxLength={20}
              required
              className="min-w-0 rounded-xl border border-glass-border bg-background p-3"
            />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
            Shares
            <input
              value={shares}
              onChange={(event) => setShares(event.target.value)}
              type="number"
              min="0.000001"
              max="1000000000000"
              step="any"
              required
              className="min-w-0 rounded-xl border border-glass-border bg-background p-3"
            />
          </label>
          <button
            type="submit"
            disabled={saving || !ready}
            className="rounded-full bg-electric/15 px-6 py-3 text-electric disabled:opacity-50"
          >
            {saving ? "Checking ticker…" : "Save holding"}
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-4 text-red-400">
            {error}
          </p>
        )}
        {storageWarning && (
          <p role="status" className="mt-4 text-amber-300">
            {storageWarning}
          </p>
        )}
        {holdings.length === 0 ? (
          <p className="py-10 text-muted-foreground">
            Add your first holding to see its estimated value.
          </p>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                {Array.from(totals, ([currency, value]) => (
                  <p key={currency} className="text-2xl">
                    {currency}:{" "}
                    {formatPrice(value, currency === "Unknown currency" ? null : currency)}
                  </p>
                ))}
              </div>
              <button
                onClick={() => void query.refetch()}
                disabled={query.isFetching}
                className="rounded-full border border-glass-border px-5 py-2 text-sm"
              >
                {query.isFetching ? "Updating…" : "Refresh valuations"}
              </button>
            </div>
            {query.error && (
              <p role="alert" className="mt-4 text-red-400">
                {query.error.message}
              </p>
            )}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-glass-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-electric/5">
                  <tr>
                    {["Ticker", "Shares", "Last price", "Value", "Actions"].map((label) => (
                      <th key={label} className="p-4">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.symbol} className="border-t border-glass-border">
                      <td className="p-4 font-semibold">{row.symbol}</td>
                      <td className="p-4">{row.shares}</td>
                      <td className="p-4">
                        {row.quote
                          ? formatPrice(row.quote.current_price, row.quote.currency)
                          : "Unavailable"}
                      </td>
                      <td className="p-4">
                        {row.quote
                          ? formatPrice(row.shares * row.quote.current_price, row.quote.currency)
                          : "Unavailable"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            setHoldings((previous) =>
                              previous.filter((item) => item.symbol !== row.symbol),
                            )
                          }
                          aria-label={`Remove ${row.symbol} holding`}
                          className="text-red-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Values use the latest available closing prices. Different currencies are totaled
              separately; no exchange conversion is applied.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
