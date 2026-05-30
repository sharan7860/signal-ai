import React, { useState, useEffect, useCallback } from "react";
import { Activity, BarChart3, Gauge, LineChart, ShieldAlert, TrendingUp, RefreshCcw, AlertTriangle, ChevronDown } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import { fetchAnalytics, AnalyticsData } from "@/services/analyticsService";
import { motion, AnimatePresence } from "framer-motion";

const POLLING_INTERVAL = 30000; // 30 seconds

export function AnalyticsGrid() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [symbol, setSymbol] = useState("NVDA");
  const [inputValue, setInputValue] = useState("NVDA");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, []);

  const loadData = useCallback(async (targetSymbol: string, isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const result = await fetchAnalytics(targetSymbol);
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setError(null);
    } catch (err) {
      console.error("Analytics fetch failed:", err);
      setError(`Failed to analyze ${targetSymbol}. Please check the ticker.`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedSymbol = inputValue.trim().toUpperCase();
    if (formattedSymbol && formattedSymbol !== symbol) {
      setSymbol(formattedSymbol);
    }
  };

  useEffect(() => {
    loadData(symbol);
    
    const interval = setInterval(() => {
      loadData(symbol, true);
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadData, symbol]);

  if (!isMounted) return null;

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card h-48 animate-pulse rounded-2xl p-6" />
        ))}
      </div>
    );
  }

  const indicators = data ? [
    { 
      name: "RSI (14)", 
      value: data.rsi.value, 
      state: data.rsi.status, 
      desc: data.rsi.description, 
      color: (data.rsi.status === "NEUTRAL" ? "cyan" : "emerald") as any, 
      icon: Activity,
      percentage: data.rsi.value
    },
    { 
      name: "MACD", 
      value: data.macd.value > 0 ? `+${data.macd.value}` : data.macd.value, 
      state: data.macd.status, 
      desc: data.macd.description, 
      color: (data.macd.status.includes("BULLISH") ? "emerald" : "red") as any, 
      icon: LineChart,
      percentage: Math.min(100, Math.max(0, 50 + data.macd.value * 10))
    },
    { 
      name: "MA 50/200", 
      value: data.moving_average.signal, 
      state: data.moving_average.status, 
      desc: data.moving_average.description, 
      color: (data.moving_average.status === "BULLISH" ? "emerald" : "red") as any, 
      icon: TrendingUp,
      percentage: data.moving_average.status === "BULLISH" ? 85 : 35
    },
    { 
      name: "Sentiment", 
      value: data.sentiment.value, 
      state: data.sentiment.status, 
      desc: `${data.sentiment.sources.toLocaleString()} sources analyzed`, 
      color: (data.sentiment.status === "POSITIVE" ? "emerald" : "red") as any, 
      icon: BarChart3,
      percentage: data.sentiment.value * 100
    },
    { 
      name: "Tech Score", 
      value: data.tech_score.value, 
      state: data.tech_score.status, 
      desc: "Neural consensus verdict", 
      color: "electric" as any, 
      icon: Gauge,
      percentage: data.tech_score.value * 10
    },
    { 
      name: "Risk Score", 
      value: data.risk_score.value, 
      state: data.risk_score.status, 
      desc: data.risk_score.description, 
      color: (data.risk_score.status === "LOW" ? "electric" : "orange") as any, 
      icon: ShieldAlert,
      percentage: (10 - data.risk_score.value) * 10
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
           <form onSubmit={handleSubmit} className="relative group">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                placeholder="Search Ticker..."
                onFocus={(e) => e.currentTarget.select()}
                className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm font-semibold focus:outline-none focus:border-electric transition-all w-48 placeholder:text-muted-foreground/30"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-electric transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
              </button>
           </form>
           
           <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className={`relative flex h-2 w-2 ${isRefreshing ? 'animate-spin' : ''}`}>
                 <span className={`absolute inset-0 rounded-full bg-electric ${isRefreshing ? 'opacity-100' : 'opacity-40'}`} />
                 {!isRefreshing && <span className="relative inline-flex rounded-full h-2 w-2 bg-electric"></span>}
              </span>
              {isRefreshing ? 'Syncing...' : `Last update: ${lastUpdated}`}
           </div>
        </div>

        {error && (
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-orange-400 font-bold"
           >
              <AlertTriangle className="h-3 w-3" />
              {error}
           </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {indicators.map((ind, i) => (
          <AnalyticsCard
            key={ind.name}
            {...ind}
            delay={i * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
