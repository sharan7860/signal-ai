import { useState, type FormEvent } from "react";
import { Brain, RefreshCw, Search } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useMarket } from "@/hooks/use-market";
import { formatPrice } from "@/services/marketService";

const ranges = { "1W": 5, "1M": 22, "3M": 66, "1Y": 260 };

function SymbolSearch({
  symbol,
  onSelect,
}: {
  symbol: string;
  onSelect: (symbol: string) => void;
}) {
  const [value, setValue] = useState(symbol);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = value.trim().toUpperCase();
    if (!/^[A-Z0-9.^=-]{1,20}$/.test(next)) {
      setError("Enter a valid ticker, such as AAPL or RELIANCE.NS.");
      return;
    }
    setError("");
    onSelect(next);
  };
  return (
    <form onSubmit={submit} className="flex-1">
      <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
        <Search className="h-4 w-4 shrink-0" />
        <input
          aria-label="Stock symbol"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search ticker (AAPL, RELIANCE.NS)"
          maxLength={20}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-electric/15 px-4 py-2 text-sm text-electric"
        >
          Analyze
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}

export function PredictionDashboard() {
  const { symbol, selectSymbol, data, isPending, isFetching, error, refresh } = useMarket();
  const [range, setRange] = useState<keyof typeof ranges>("3M");
  const history = data?.quote.historical_closes.slice(-ranges[range]) ?? [];
  const forecast = data?.analysis.forecast;
  const last = history.at(-1);
  const chartData = [
    ...history.map((point, index) => ({
      date: point.date,
      actual: point.close,
      projected: index === history.length - 1 && forecast ? point.close : null,
    })),
    ...(forecast?.predicted_prices.map((point) => ({
      date: point.date,
      projected: point.price,
      actual: null,
    })) ?? []),
  ];
  return (
    <section id="dashboard" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-electric">
            <Brain className="h-4 w-4" /> Market analysis
          </div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Explore a stock. <span className="text-gradient">Understand its signals.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Latest available market data, technical indicators and an illustrative 30-weekday
            projection.
          </p>
        </div>
        <div className="glass-card rounded-3xl p-5 md:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <SymbolSearch key={symbol} symbol={symbol} onSelect={selectSymbol} />
            <button
              onClick={refresh}
              disabled={isFetching}
              aria-label="Refresh market data"
              className="rounded-full border border-glass-border p-4 disabled:opacity-50"
            >
              <RefreshCw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </button>
          </div>
          {isPending && (
            <p role="status" className="py-16 text-center text-muted-foreground">
              Loading {symbol} market data…
            </p>
          )}
          {error && (
            <div role="alert" className="my-6 rounded-2xl border border-red-400/30 p-5">
              <p>
                Unable to load {symbol}: {error.message}
              </p>
              <button onClick={refresh} className="mt-3 text-electric underline">
                Try again
              </button>
            </div>
          )}
          {data && (
            <>
              <div className="mt-8 flex flex-wrap justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-3xl">{data.quote.symbol}</h3>
                    <span className="rounded-full bg-electric/15 px-3 py-1 text-xs text-electric">
                      Rules: {data.analysis.recommendation}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{data.quote.company_name}</p>
                  <div className="mt-3 font-display text-4xl">
                    {formatPrice(data.quote.current_price, data.quote.currency)}
                  </div>
                  <p
                    className={
                      (data.quote.percentage_change ?? 0) >= 0
                        ? "text-emerald-trend"
                        : "text-red-trend"
                    }
                  >
                    {data.quote.percentage_change === null
                      ? "Change unavailable"
                      : `${data.quote.percentage_change >= 0 ? "+" : ""}${data.quote.percentage_change.toFixed(2)}% vs previous close`}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Price as of {last?.date}. Quotes may be delayed.
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-8">
                  <div>
                    <p className="text-xs text-muted-foreground">Signal agreement</p>
                    <p className="text-2xl">{Math.round(data.analysis.confidence_score * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-2xl">{data.quote.volume.toLocaleString("en-US")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rule sentiment</p>
                    <p className="text-2xl">{data.analysis.sentiment.toLowerCase()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-2" aria-label="Chart time range">
                {(Object.keys(ranges) as Array<keyof typeof ranges>).map((item) => (
                  <button
                    key={item}
                    aria-pressed={range === item}
                    onClick={() => setRange(item)}
                    className={`rounded-full px-4 py-2 text-xs ${range === item ? "bg-electric/20 text-electric" : "text-muted-foreground"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div
                className="mt-4 h-[340px] min-w-0"
                aria-label={`${symbol} historical price and baseline projection`}
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke="rgba(100,200,200,0.1)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      minTickGap={45}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      width={65}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={(value: number) => value.toFixed(0)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: 12,
                      }}
                      formatter={(value: number) => formatPrice(value, data.quote.currency)}
                    />
                    <Line
                      name="Closing price"
                      dataKey="actual"
                      stroke="#f1f5f9"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      name="Baseline projection"
                      dataKey="projected"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 rounded-2xl bg-electric/5 p-5">
                <p className="text-sm font-medium text-electric">Why this signal?</p>
                <p className="mt-2 text-sm">{data.analysis.summary}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {forecast
                    ? `${forecast.method}. ${forecast.note}`
                    : "Not enough history for a projection."}{" "}
                  Signal agreement is not a prediction accuracy score.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
