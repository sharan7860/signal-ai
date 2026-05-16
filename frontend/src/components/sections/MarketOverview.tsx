import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { AnimatedSparkline } from "@/components/AnimatedSparkline";
import { useEffect, useState } from "react";
import { fetchTrendingStocks } from "@/services/api";
import { Clock } from "lucide-react";

function getMarketStatus() {
  const now = new Date();
  
  // Convert current time to ET for market hours check
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const day = parts.find(p => p.type === 'weekday')?.value || '';
  
  const isWeekend = day === 'Sat' || day === 'Sun';
  const totalMinutes = hour * 60 + minute;
  const isWithinHours = totalMinutes >= (9 * 60 + 30) && totalMinutes < (16 * 60);
  
  const isOpen = !isWeekend && isWithinHours;

  // Format full display string
  const displayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return {
    isOpen,
    displayTime: displayFormatter.format(now)
  };
}

export function MarketOverview() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrendingStocks();
      setStocks(data);
      setMarketStatus(getMarketStatus());
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setError("Failed to load market data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

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
            <div className="mt-4 flex items-center gap-3">
              <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                marketStatus.isOpen 
                  ? "border-emerald-trend/30 bg-emerald-trend/5 text-emerald-trend" 
                  : "border-red-trend/30 bg-red-trend/5 text-red-trend"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${marketStatus.isOpen ? "bg-emerald-trend animate-pulse" : "bg-red-trend"}`} />
                Market {marketStatus.isOpen ? "Open" : "Closed"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {marketStatus.displayTime} ET
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loading && <RefreshCcw className="h-4 w-4 animate-spin text-muted-foreground" />}
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
          </div>
        </motion.div>

        {error && (
          <div className="glass rounded-xl p-6 text-center text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {loading && stocks.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse rounded-2xl" />
            ))
          ) : (
            stocks.map((t, i) => {
              const chg = t.percentage_change || 0;
              const positive = chg >= 0;
              const history = t.historical_closes?.map((p: any) => p.close) || [];
              
              return (
                <motion.div
                  key={t.symbol}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass-card group cursor-pointer overflow-hidden rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-base font-semibold tracking-wide">{t.symbol}</div>
                      <div className="mt-1 text-xs text-muted-foreground">${t.current_price?.toFixed(2)}</div>
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
                      {chg.toFixed(2)}%
                    </div>
                  </div>
                  <div className="mt-4 h-14">
                    <AnimatedSparkline
                      data={history.slice(-12)}
                      color={positive ? "var(--emerald-trend)" : "var(--red-trend)"}
                      height={56}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Ticker tape */}
        {!loading && stocks.length > 0 && (
          <div className="glass relative mt-10 overflow-hidden rounded-full py-3">
            <div className="flex gap-12 whitespace-nowrap" style={{ animation: "ticker 40s linear infinite" }}>
              {[...stocks, ...stocks, ...stocks].map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="font-display font-semibold tracking-wider">{t.symbol}</span>
                  <span className="text-muted-foreground">${t.current_price?.toFixed(2)}</span>
                  <span className={(t.percentage_change || 0) >= 0 ? "text-emerald-trend" : "text-red-trend"}>
                    {(t.percentage_change || 0) >= 0 ? "▲" : "▼"} {Math.abs(t.percentage_change || 0).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
