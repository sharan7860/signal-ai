import { motion } from "framer-motion";
import { Search, Brain, ArrowUp, Sparkles } from "lucide-react";
import { useState } from "react";
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
  ReferenceDot,
} from "recharts";

const chartData = Array.from({ length: 40 }, (_, i) => {
  const base = 180 + i * 1.2 + Math.sin(i / 3) * 8;
  return {
    day: `D${i + 1}`,
    actual: i < 28 ? +(base + (Math.random() - 0.5) * 6).toFixed(2) : null,
    predicted: +(base + Math.sin(i / 4) * 4 + (i > 25 ? (i - 25) * 1.8 : 0)).toFixed(2),
    upper: +(base + Math.sin(i / 4) * 4 + (i > 25 ? (i - 25) * 1.8 : 0) + 8).toFixed(2),
    lower: +(base + Math.sin(i / 4) * 4 + (i > 25 ? (i - 25) * 1.8 : 0) - 8).toFixed(2),
  };
});

export function PredictionDashboard() {
  const [symbol, setSymbol] = useState("NVDA");

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
            <Brain className="h-3.5 w-3.5" /> AI Prediction Engine
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            See tomorrow's market <span className="text-gradient">today</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our forecasting models combine LSTM neural networks, technical indicators and macro sentiment to deliver high-confidence predictions.
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
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <span className="hidden text-xs text-muted-foreground md:block">⌘K</span>
            </div>
            <div className="flex items-center gap-2">
              {["1D", "1W", "1M", "3M", "1Y"].map((r, i) => (
                <button
                  key={r}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    i === 2
                      ? "bg-electric/15 text-electric"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Header stats */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-semibold">{symbol}</span>
                <span className="rounded-full bg-emerald-trend/15 px-2.5 py-1 text-xs font-medium text-emerald-trend">
                  AI: BUY
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-4xl font-semibold">$892.34</span>
                <span className="flex items-center gap-1 text-emerald-trend">
                  <ArrowUp className="h-4 w-4" /> +37.42 (4.21%)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Stat label="Predicted (7d)" value="$948.12" delta="+6.25%" positive />
              <Stat label="Confidence" value="94%" delta="High" positive />
              <Stat label="Risk score" value="3.2/10" delta="Low" positive />
            </div>
          </div>

          {/* Chart */}
          <div className="mt-8 h-[360px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="conf" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.18 245)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="oklch(0.7 0.18 245)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="actualG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.97 0.01 240)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="oklch(0.97 0.01 240)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.7 0.18 245 / 0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.028 254 / 0.95)",
                    border: "1px solid oklch(0.65 0.1 245 / 0.3)",
                    borderRadius: 12,
                    backdropFilter: "blur(16px)",
                  }}
                  labelStyle={{ color: "oklch(0.97 0.01 240)" }}
                />
                <ReferenceLine x="D28" stroke="oklch(0.7 0.18 245 / 0.6)" strokeDasharray="4 4" label={{ value: "Now", fill: "oklch(0.7 0.18 245)", fontSize: 11 }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#conf)" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="oklch(0.18 0.025 254)" />
                <Line type="monotone" dataKey="actual" stroke="oklch(0.97 0.01 240)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="oklch(0.7 0.18 245)" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
                <ReferenceDot x="D6" y={chartData[5].actual ?? undefined} r={6} fill="oklch(0.78 0.18 155)" stroke="oklch(0.18 0.025 254)" strokeWidth={2} label={{ value: "BUY", position: "top", fill: "oklch(0.78 0.18 155)", fontSize: 10, fontWeight: 600 }} />
                <ReferenceDot x="D18" y={chartData[17].actual ?? undefined} r={6} fill="oklch(0.7 0.21 22)" stroke="oklch(0.18 0.025 254)" strokeWidth={2} label={{ value: "SELL", position: "top", fill: "oklch(0.7 0.21 22)", fontSize: 10, fontWeight: 600 }} />
                <ReferenceDot x="D24" y={chartData[23].actual ?? undefined} r={6} fill="oklch(0.78 0.18 155)" stroke="oklch(0.18 0.025 254)" strokeWidth={2} label={{ value: "BUY", position: "top", fill: "oklch(0.78 0.18 155)", fontSize: 10, fontWeight: 600 }} />
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
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                    Recommendation generated because <span className="text-electric">RSI is oversold (28)</span>, MACD shows bullish crossover, and the prediction trend is strongly upward across the 7-day forecast window. Sentiment analysis on 1,243 news sources supports continued momentum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
