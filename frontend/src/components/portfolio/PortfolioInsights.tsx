
import React, { useState, useEffect, useCallback } from "react";
import { BrainCircuit, ShieldCheck, Zap, RefreshCcw, AlertTriangle, Info } from "lucide-react";
import { PortfolioCard } from "./PortfolioCard";
import { fetchPortfolioAnalytics, PortfolioAnalytics } from "@/services/portfolioService";
import { motion, AnimatePresence } from "framer-motion";

const POLLING_INTERVAL = 30000; // 30 seconds

export function PortfolioInsights() {
  const [data, setData] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      // Get watchlist from localStorage for context
      const saved = localStorage.getItem("trader_watchlist");
      const watchlist = saved ? JSON.parse(saved) : ["AAPL", "NVDA", "TSLA"];
      const result = await fetchPortfolioAnalytics(watchlist);
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setError(null);
    } catch (err) {
      console.error("Portfolio analytics fetch failed:", err);
      setError("AI Neural Network disconnected. Retrying...");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadData();
    
    const handleUpdate = () => loadData(true);
    window.addEventListener("trader_watchlist_updated", handleUpdate);

    const interval = setInterval(() => {
      loadData(true);
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(interval);
      window.removeEventListener("trader_watchlist_updated", handleUpdate);
    };
  }, [loadData]);

  if (!isMounted) return null;

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card h-48 animate-pulse rounded-2xl p-6" />
        ))}
      </div>
    );
  }

  const metrics = data ? [
    {
      title: "AI Portfolio Score",
      ...data.portfolio_score,
      icon: BrainCircuit,
      color: (data.portfolio_score.status === "Strong" ? "emerald" : "electric") as any,
    },
    {
      title: "Risk Resilience",
      ...data.risk_resilience,
      icon: ShieldCheck,
      color: (data.risk_resilience.status === "High" ? "purple" : "electric") as any,
    },
    {
      title: "Alpha (30D)",
      ...data.alpha,
      icon: Zap,
      color: (data.alpha.status === "Positive" ? "emerald" : "orange") as any,
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className={`relative flex h-2 w-2 ${isRefreshing ? 'animate-spin' : ''}`}>
                 <span className={`absolute inset-0 rounded-full bg-electric ${isRefreshing ? 'opacity-100' : 'opacity-40'}`} />
                 {!isRefreshing && <span className="relative inline-flex rounded-full h-2 w-2 bg-electric"></span>}
              </span>
              {isRefreshing ? 'Syncing Portfolio...' : `Network Active • Last Sync: ${lastUpdated}`}
            </div>
        </div>

        <div className="flex items-center gap-4">
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
           <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Info className="h-3 w-3" />
              Benchmark: S&P 500
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.map((metric, i) => (
          <PortfolioCard
            key={metric.title}
            {...metric}
            delay={i * 0.1}
          />
        ))}
      </div>
    </div>
  );
}
