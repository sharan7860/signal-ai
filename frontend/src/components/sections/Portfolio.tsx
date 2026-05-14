import { motion } from "framer-motion";
import { ArrowUp, Brain, Shield, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CountUp } from "@/components/CountUp";
import { CircularProgress } from "@/components/CircularProgress";
import { useState, useEffect } from "react";
import { fetchBatchInfo } from "@/services/api";
import { Plus, Trash2, PieChart } from "lucide-react";

const sectorColors: Record<string, string> = {
  "Technology": "var(--primary)",
  "Healthcare": "var(--emerald-trend)",
  "Financial Services": "#60A5FA",
  "Consumer Cyclical": "#FBBF24",
  "Communication Services": "#F472B6",
  "Energy": "#F87171",
  "Other": "#94A3B8",
};

import { PortfolioInsights } from "../portfolio/PortfolioInsights";

export function Portfolio() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trader_watchlist");
      return saved ? JSON.parse(saved) : ["AAPL", "NVDA", "TSLA", "MSFT", "GOOGL"];
    }
    return ["AAPL", "NVDA", "TSLA", "MSFT", "GOOGL"];
  });
  const [newTicker, setNewTicker] = useState("");
  const [infoMap, setInfoMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("trader_watchlist", JSON.stringify(watchlist));
    window.dispatchEvent(new CustomEvent("trader_watchlist_updated", { detail: watchlist }));
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const data = await fetchBatchInfo(watchlist);
        const map: Record<string, any> = {};
        data.info.forEach((item: any) => {
          map[item.symbol] = item;
        });
        setInfoMap(map);
      } catch (err) {
        console.error("Error fetching portfolio info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [watchlist]);

  const addTicker = () => {
    const sym = newTicker.trim().toUpperCase();
    if (sym && !watchlist.includes(sym)) {
      setWatchlist([...watchlist, sym]);
      setNewTicker("");
    }
  };

  const removeTicker = (sym: string) => {
    setWatchlist(watchlist.filter(s => s !== sym));
  };

  // Calculate allocation
  const calculateAllocation = () => {
    const totals: Record<string, number> = {};
    watchlist.forEach(sym => {
      const sector = infoMap[sym]?.sector || "Other";
      totals[sector] = (totals[sector] || 0) + 1;
    });

    const totalCount = watchlist.length;
    if (totalCount === 0) return [];

    return Object.entries(totals).map(([label, count]) => ({
      label,
      pct: Math.round((count / totalCount) * 100),
      color: sectorColors[label] || sectorColors["Other"],
    }));
  };

  const allocation = calculateAllocation();

  return (
    <section id="portfolio" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">Portfolio Intelligence</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            AI-Driven<br /><span className="text-gradient">Portfolio Wealth.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-10">
          {/* Performance card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden rounded-3xl p-7 lg:col-span-2"
          >
             <div className="mb-6 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Active Analysis Watchlist</div>
                <div className="flex items-center gap-2">
                   <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5 border border-white/5">
                      <input 
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                        placeholder="ADD TICKER..." 
                        className="w-24 bg-transparent text-[10px] outline-none placeholder:text-muted-foreground"
                      />
                      <button onClick={addTicker} className="text-electric hover:scale-110 transition-transform">
                        <Plus className="h-4 w-4" />
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {watchlist.map(sym => (
                   <div key={sym} className="glass group relative flex flex-col items-center justify-center rounded-2xl p-4 transition-all hover:border-electric/40">
                      <button 
                        onClick={() => removeTicker(sym)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 scale-0 items-center justify-center rounded-full bg-red-trend/20 text-red-trend opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="font-display text-sm font-semibold">{sym}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">{infoMap[sym]?.sector || '---'}</div>
                   </div>
                ))}
             </div>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-white/5 pt-8">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Est. Portfolio Value</div>
                <div className="mt-1 font-display text-4xl font-semibold text-gradient">
                  <CountUp to={142847.92} decimals={2} prefix="$" />
                </div>
              </div>
              <div className="flex gap-6">
                <Stat label="Total Assets" to={watchlist.length} />
                <Stat label="Sectors" to={new Set(watchlist.map(s => infoMap[s]?.sector)).size} />
              </div>
            </div>
          </motion.div>

          {/* Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card relative overflow-hidden rounded-3xl p-7"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Allocation Distribution</div>
              <PieChart className="h-4 w-4 text-electric" />
            </div>
            
            <div className="mt-8 flex items-center justify-center">
              <CircularProgress
                segments={allocation}
                size={180}
                thickness={14}
                centerLabel="Holdings"
                centerValue={watchlist.length.toString()}
              />
            </div>
            
            <div className="mt-8 space-y-3">
              {allocation.map((a) => (
                <div key={a.label} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: a.color, boxShadow: `0 0 10px ${a.color}` }} />
                  <div className="flex flex-1 items-center justify-between text-xs">
                    <span className="text-foreground/85">{a.label}</span>
                    <span className="font-mono text-muted-foreground">{a.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Portfolio Intelligence Metrics */}
        <PortfolioInsights />
      </div>
    </section>
  );
}

function Stat({ label, to, prefix }: { label: string; to: number; prefix?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold text-electric">
        <CountUp to={to} prefix={prefix} />
      </div>
    </div>
  );
}
