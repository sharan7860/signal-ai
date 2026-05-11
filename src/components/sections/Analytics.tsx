import { motion } from "framer-motion";
import { Activity, BarChart3, Gauge, LineChart, ShieldAlert, TrendingUp } from "lucide-react";

const indicators = [
  { name: "RSI (14)", value: "28.4", state: "Oversold", color: "emerald", icon: Activity, desc: "Momentum suggests reversal" },
  { name: "MACD", value: "+1.82", state: "Bullish Cross", color: "emerald", icon: LineChart, desc: "Signal line crossed up" },
  { name: "MA 50/200", value: "Golden", state: "Bullish", color: "emerald", icon: TrendingUp, desc: "MA50 above MA200" },
  { name: "Sentiment", value: "0.74", state: "Positive", color: "emerald", icon: BarChart3, desc: "1,243 sources analyzed" },
  { name: "Tech Score", value: "8.6", state: "Strong", color: "electric", icon: Gauge, desc: "Composite of 24 signals" },
  { name: "Risk Score", value: "3.2", state: "Low", color: "electric", icon: ShieldAlert, desc: "Low volatility regime" },
];

export function Analytics() {
  return (
    <section id="analytics" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-widest text-electric">Deep Analytics</div>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Every signal. <span className="text-gradient">One verdict.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            We aggregate 24 technical, fundamental and sentiment indicators into a single AI-weighted recommendation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {indicators.map((ind, i) => {
            const Icon = ind.icon;
            const accent = ind.color === "emerald" ? "text-emerald-trend" : "text-electric";
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-6"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-50" style={{ background: ind.color === "emerald" ? "var(--gradient-emerald)" : "var(--gradient-electric)" }} />
                <div className="flex items-start justify-between">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl glass ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`text-xs font-medium uppercase tracking-wider ${accent}`}>{ind.state}</div>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-muted-foreground">{ind.name}</div>
                  <div className="mt-1 font-display text-3xl font-semibold">{ind.value}</div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{ind.desc}</div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${50 + i * 8}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: ind.color === "emerald" ? "var(--gradient-emerald)" : "var(--gradient-electric)" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
