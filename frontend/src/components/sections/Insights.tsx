import { motion } from "framer-motion";
import { Sparkles, Brain, Gauge, ExternalLink, Calendar, Clock, Zap, Newspaper } from "lucide-react";
import { TypingText } from "@/components/TypingText";
import { CountUp } from "@/components/CountUp";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWatchlistNews } from "@/services/api";
import { playNotificationSound, notifyNewSignal } from "@/lib/notifications";

export function Insights() {
  const [news, setNews] = useState<any[]>([]);
  const [recentCount, setRecentCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const seenSignals = useRef<Set<string>>(new Set());

  // Function to load news
  const loadNews = useCallback(async (targetWatchlist: string[]) => {
    if (!targetWatchlist || targetWatchlist.length === 0) {
      setNews([]);
      setRecentCount(0);
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchWatchlistNews(targetWatchlist);
<<<<<<< HEAD
      const allNews = data.news || [];
=======
      const rawNews = data?.news || [];
      
      // Deduplicate news based on title or ID
      const seenIds = new Set();
      const allNews = rawNews.filter((n: any) => {
        if (!n) return false;
        const key = n.id || n.title;
        if (!key) return false;
        if (seenIds.has(key)) return false;
        seenIds.add(key);
        return true;
      });
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
      
      const now = Math.floor(Date.now() / 1000);
      const twentyMinsAgo = now - 1200;
      
      const freshNews = allNews.filter((n: any) => n.provider_publish_time >= twentyMinsAgo);
      setRecentCount(freshNews.length);
      
      // Alert on new high-priority signals
      freshNews.forEach((signal: any) => {
<<<<<<< HEAD
        if (!seenSignals.current.has(signal.id)) {
=======
        if (signal?.id && !seenSignals.current.has(signal.id)) {
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
          seenSignals.current.add(signal.id);
          playNotificationSound();
          notifyNewSignal({
            id: signal.id,
            title: signal.title,
            symbol: signal.symbol
          });
        }
      });

      setNews(allNews);
    } catch (err) {
      console.error("Error fetching news:", err);
<<<<<<< HEAD
=======
      setNews([]); // Clear news on error
      setRecentCount(0);
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and event listeners
  useEffect(() => {
    const getSavedWatchlist = () => {
      const saved = localStorage.getItem("trader_watchlist");
      return saved ? JSON.parse(saved) : ["AAPL", "NVDA", "TSLA", "MSFT", "GOOGL"];
    };

    const initialWatchlist = getSavedWatchlist();
    setWatchlist(initialWatchlist);
    loadNews(initialWatchlist);

    // Listen for custom watchlist updates
    const handleUpdate = (e: any) => {
      const updatedList = e.detail;
      setWatchlist(updatedList);
      loadNews(updatedList);
    };

    window.addEventListener("trader_watchlist_updated", handleUpdate);
    
    // Polling interval
    const interval = setInterval(() => {
      const currentList = getSavedWatchlist();
      loadNews(currentList);
    }, 45000); // Poll every 45s

    return () => {
      window.removeEventListener("trader_watchlist_updated", handleUpdate);
      clearInterval(interval);
    };
  }, [loadNews]);

  const summary = news.length > 0 
    ? `Atlas-4 detected ${recentCount} high-priority signals in the last 20 minutes. Portfolio sentiment is trending ${recentCount > 0 ? 'upwards' : 'neutral'}. Key update: ${news[0]?.title}`
    : "Analyzing global market pipelines... Add tickers to your watchlist to initiate real-time intelligence monitoring.";

  return (
    <section id="insights" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-electric">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric"></span>
            </span>
            Live AI Insights
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Real-time Intelligence,<br />
            <span className="text-gradient">refreshed 20m ago.</span>
          </h2>
        </motion.div>

        {/* Ultra-Fast AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card relative mb-12 overflow-hidden rounded-3xl p-7"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-25 blur-3xl" style={{ background: "var(--gradient-electric)" }} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-electric)" }}>
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-electric">Live Pipeline · Last 20 Mins</div>
                  <div className="font-display text-lg font-semibold flex items-center gap-2">
                    Dynamic Portfolio Pulse
                    {recentCount > 0 && (
                      <span className="inline-flex items-center rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-medium text-electric animate-pulse">
                        {recentCount} NEW SIGNALS
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-base leading-relaxed text-foreground/85">
                <TypingText text={summary} speed={8} />
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <Meter label="20m Momentum" value={recentCount > 0 ? 85 : 50} accent="electric" rightLabel={recentCount > 0 ? "Surging" : "Stable"} />
              <Meter label="Watchlist Signal Strength" value={78} accent="emerald" rightLabel="High" />
            </div>
          </div>
        </motion.div>

        {/* Live News Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && news.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-48 animate-pulse rounded-3xl" />
            ))
          ) : (
            news.map((item, i) => {
              const isVeryRecent = Math.floor(Date.now() / 1000) - item.provider_publish_time < 1200;
              return (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`glass-card group flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all hover:border-primary/40 ${isVeryRecent ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-electric">
                          {item.symbol}
                        </span>
                        {isVeryRecent && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-trend uppercase tracking-tighter">
                            <Clock className="h-2.5 w-2.5" /> Just Now
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(item.provider_publish_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight group-hover:text-electric transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      {item.publisher}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-electric" />
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Signal</span>
                     </div>
                     <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full glass hover:bg-primary/20 transition-colors"
                     >
                       <ExternalLink className="h-4 w-4 text-electric" />
                     </a>
                  </div>
                </motion.div>
              );
            })
          )}

          {!loading && news.length === 0 && (
             <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 opacity-40">
                <Newspaper className="mb-4 h-12 w-12" />
                <p className="text-sm">No live news found for your current watchlist.</p>
                <p className="mt-2 text-[10px] uppercase tracking-widest">Try adding major tickers like AAPL, TSLA, or NVDA</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Meter({ label, value, accent, rightLabel }: { label: string; value: number; accent: "electric" | "emerald"; rightLabel: string }) {
  const grad = accent === "electric" ? "var(--gradient-electric)" : "var(--gradient-emerald)";
  const color = accent === "electric" ? "text-electric" : "text-emerald-trend";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-display ${color}`}>{rightLabel} · <CountUp to={value} /></span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: grad, boxShadow: `0 0 10px ${accent === "electric" ? "var(--electric)" : "var(--emerald-trend)"}` }}
        />
      </div>
    </div>
  );
}
