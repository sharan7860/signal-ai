
import { motion } from "framer-motion";
import { Search, Brain, ArrowUp, Sparkles, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { fetchStockForecast, fetchStockQuote, fetchStockAnalytics } from "@/services/api";
import { DeepAnalytics } from "./DeepAnalytics";

export function PredictionDashboard() {
  const [symbol, setSymbol] = useState("NVDA");
  const [data, setData] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [forecastData, quoteData, analyticsData] = await Promise.all([
          fetchStockForecast(symbol),
          fetchStockQuote(symbol),
          fetchStockAnalytics(symbol)
        ]);

        const formattedChartData = [
          ...(forecastData.history || []).map((h: any) => ({
            day: h.date,
            actual: h.close,
            predicted: null,
            upper: null,
            lower: null
          })),
          ...(forecastData.forecast || []).map((f: any) => ({
            day: f.date,
            actual: null,
            predicted: f.forecast,
            upper: f.upper,
            lower: f.lower
          }))
        ];

        setData(formattedChartData);
        setQuote(quoteData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setData([]);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 800);
    return () => clearTimeout(timer);
  }, [symbol]);

  const currentPrice = quote?.current_price || 0;
  const change = quote?.percentage_change || 0;
  const isPositive = change >= 0;

  return (
    <section id="dashboard" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-electric">
            <Brain className="h-3.5 w-3.5" /> AI recommendation Engine
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            See tomorrow's market <span className="text-gradient">today</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our ARIMA models analyze historical trends and seasonal patterns to deliver high-confidence business-day forecasts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card relative overflow-hidden rounded-3xl p-6 md:p-8"
        >
          {/* Search */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="glass relative flex flex-1 items-center gap-3 rounded-full px-5 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Search symbol (e.g. NVDA, AAPL)"
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <span className="hidden text-xs text-muted-foreground md:block">⌘K</span>
            </div>
            {loading && (
              <div className="flex items-center gap-2 px-3">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-electric border-t-transparent" />
                <span className="text-xs text-muted-foreground">Analyzing...</span>
              </div>
            )}
          </div>

          {/* Header stats */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-semibold">{symbol}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isPositive ? 'bg-emerald-trend/15 text-emerald-trend' : 'bg-red-trend/15 text-red-trend'}`}>
                  AI: {isPositive ? 'BUY' : 'HOLD'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-4xl font-semibold">${currentPrice.toLocaleString()}</span>
                <span className={`flex items-center gap-1 ${isPositive ? 'text-emerald-trend' : 'text-red-trend'}`}>
                  {isPositive ? <ArrowUp className="h-4 w-4" /> : <Activity className="h-4 w-4" />} {quote?.change?.toFixed(2) || '0.00'} ({change?.toFixed(2) || '0.00'}%)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Stat
                label="Predicted (Target)"
                value={data && data.length > 0 && data[data.length - 1].predicted ? `$${data[data.length - 1].predicted.toFixed(2)}` : '---'}
                delta={data && data.length > 0 && data[data.length - 1].predicted ? `${(((data[data.length - 1].predicted - currentPrice) / currentPrice) * 100).toFixed(2)}%` : '0%'}
                positive={data && data.length > 0 && data[data.length - 1].predicted > currentPrice}
              />
              <Stat label="Confidence" value="88%" delta="Medium-High" positive />
              <Stat label="Model" value="ARIMA" delta="v1.0" positive />
            </div>
          </div>

          {/* Chart */}
          <div className="mt-8 h-[360px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={data || []}>
                <defs>
                  <linearGradient id="conf" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.14 188)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="oklch(0.85 0.14 188)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.85 0.14 188 / 0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.028 254 / 0.95)",
                    border: "1px solid oklch(0.85 0.14 188 / 0.3)",
                    borderRadius: 12,
                    backdropFilter: "blur(16px)",
                  }}
                  labelStyle={{ color: "oklch(0.97 0.01 240)" }}
                />
                {data && data.length > 0 && (
                  <ReferenceLine
                    x={data.find((d: any, i: number) => d.actual !== null && data[i + 1]?.predicted !== null)?.day}
                    stroke="oklch(0.85 0.14 188 / 0.6)"
                    strokeDasharray="4 4"
                    label={{ value: "Now", fill: "oklch(0.85 0.14 188)", fontSize: 11 }}
                  />
                )}
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#conf)" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="oklch(0.18 0.025 254)" />
                <Line type="monotone" dataKey="actual" stroke="oklch(0.97 0.01 240)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="oklch(0.85 0.14 188)" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Legend + AI explanation */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex items-center gap-6 text-xs text-muted-foreground lg:col-span-1">
              <div className="flex items-center gap-2"><span className="h-2 w-6 rounded bg-foreground" /> Actual</div>
              <div className="flex items-center gap-2"><span className="h-2 w-6 rounded bg-electric" /> Predicted</div>
              <div className="flex items-center gap-2"><span className="h-2 w-6 rounded bg-electric/30" /> Confidence band</div>
            </div>

            <div className="glass relative overflow-hidden rounded-2xl p-5 lg:col-span-2">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-electric)" }} />
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: "var(--gradient-electric)" }}>
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-electric">AI Explanation</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/90 italic">
                    {analytics?.explanation || "Analyzing market signals, sentiment nodes, and technical momentum to synthesize a real-time verdict for this asset..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <DeepAnalytics analytics={analytics} loading={loading} />
      </div>
    </section>
  );
}

function Stat({ label, value, delta, positive }: { label: string; value: string; delta: string; positive?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className={`text-xs ${positive ? "text-emerald-trend" : "text-red-trend"}`}>{delta}</div>
    </div>
  );
}
