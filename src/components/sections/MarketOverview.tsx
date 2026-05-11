import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedSparkline } from "./AnimatedSparkline";

const tickers = [
  { sym: "NVDA", price: 892.34, chg: 4.21, data: [40, 42, 41, 45, 44, 48, 52, 50, 56, 60, 58, 64] },
  { sym: "AAPL", price: 224.18, chg: 1.85, data: [30, 32, 31, 33, 35, 34, 36, 38, 37, 40, 42, 41] },
  { sym: "TSLA", price: 248.92, chg: -2.14, data: [60, 58, 62, 59, 55, 57, 53, 56, 52, 50, 48, 51] },
  { sym: "MSFT", price: 421.76, chg: 0.92, data: [50, 51, 52, 51, 53, 54, 53, 55, 54, 56, 57, 58] },
  { sym: "AMZN", price: 198.45, chg: 3.12, data: [40, 41, 43, 42, 45, 44, 47, 50, 48, 52, 54, 56] },
  { sym: "META", price: 562.18, chg: 2.45, data: [45, 47, 46, 49, 50, 48, 52, 54, 53, 55, 58, 60] },
  { sym: "GOOGL", price: 178.92, chg: -0.78, data: [55, 54, 56, 53, 55, 52, 54, 51, 53, 50, 52, 49] },
  { sym: "AMD", price: 168.21, chg: 5.67, data: [35, 38, 36, 40, 42, 44, 47, 50, 53, 56, 60, 64] },
];

export function MarketOverview() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-trend opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-trend" />
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Live Market</span>
            </div>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Trending right now
            </h2>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <div>
              <div className="text-xs text-muted-foreground">Market Sentiment</div>
              <div className="font-display text-2xl font-semibold text-emerald-trend">Bullish 72</div>
            </div>
            <div className="h-12 w-px bg-glass-border" />
            <div>
              <div className="text-xs text-muted-foreground">VIX</div>
              <div className="font-display text-2xl font-semibold text-foreground">14.2</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {tickers.map((t, i) => {
            const positive = t.chg >= 0;
            return (
              <motion.div
                key={t.sym}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="glass-card group cursor-pointer overflow-hidden rounded-2xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-base font-semibold tracking-wide">{t.sym}</div>
                    <div className="mt-1 text-xs text-muted-foreground">${t.price.toFixed(2)}</div>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      positive
                        ? "bg-emerald-trend/10 text-emerald-trend"
                        : "bg-red-trend/10 text-red-trend"
                    }`}
                  >
                    {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {positive ? "+" : ""}
                    {t.chg.toFixed(2)}%
                  </div>
                </div>
                <div className="mt-4 h-14">
                  <AnimatedSparkline
                    data={t.data}
                    color={positive ? "var(--emerald-trend)" : "var(--red-trend)"}
                    height={56}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Ticker tape */}
        <div className="glass relative mt-10 overflow-hidden rounded-full py-3">
          <div className="flex gap-12 whitespace-nowrap" style={{ animation: "ticker 40s linear infinite" }}>
            {[...tickers, ...tickers, ...tickers].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="font-display font-semibold tracking-wider">{t.sym}</span>
                <span className="text-muted-foreground">${t.price.toFixed(2)}</span>
                <span className={t.chg >= 0 ? "text-emerald-trend" : "text-red-trend"}>
                  {t.chg >= 0 ? "▲" : "▼"} {Math.abs(t.chg).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
