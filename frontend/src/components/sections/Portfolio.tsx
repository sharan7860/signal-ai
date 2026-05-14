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
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">Portfolio</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your wealth,<br /><span className="text-gradient">visualized.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Performance card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden rounded-3xl p-7 lg:col-span-2"
          >
             <div className="mb-6 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Active Watchlist</div>
                <div className="flex items-center gap-2">
                   <div className="glass flex items-center gap-2 rounded-full px-4 py-1.5">
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
                   <div key={sym} className="glass group relative flex flex-col items-center justify-center rounded-2xl p-4 transition-all hover:border-primary/40">
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
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Projected Value</div>
                <div className="mt-1 font-display text-4xl font-semibold">
                  <CountUp to={142847.92} decimals={2} prefix="$" />
                </div>
              </div>
              <div className="flex gap-6">
                <Stat label="Holdings" to={watchlist.length} />
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Asset Allocation</div>
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            
            <div className="mt-8 flex items-center justify-center">
              <CircularProgress
                segments={allocation}
                size={180}
                thickness={14}
                centerLabel="Assets"
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
              {watchlist.length === 0 && (
                <div className="text-center text-xs text-muted-foreground">Add tickers to see allocation</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Portfolio Score row */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <ScoreCard icon={Brain} label="AI Portfolio Score" value={87} max={100} accent="electric" desc="Strong diversification, healthy momentum exposure." />
          <ScoreCard icon={Shield} label="Risk Resilience" value={72} max={100} accent="emerald" desc="Low drawdown vs S&P over rolling 90 days." />
          <ScoreCard icon={TrendingUp} label="Alpha (30d)" value={64} max={100} accent="electric" desc="Outperforming benchmark by +3.4%." />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, to, prefix }: { label: string; to: number; prefix?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold text-emerald-trend">
        <CountUp to={to} prefix={prefix} />
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  value,
  max,
  desc,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  max: number;
  desc: string;
  accent: "electric" | "emerald";
}) {
  const grad = accent === "electric" ? "var(--gradient-electric)" : "var(--gradient-emerald)";
  const color = accent === "electric" ? "text-electric" : "text-emerald-trend";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card group relative overflow-hidden rounded-3xl p-6"
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" style={{ background: grad }} />
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl glass ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <div className="font-display text-4xl font-semibold">
          <CountUp to={value} />
        </div>
        <div className="text-sm text-muted-foreground">/ {max}</div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: grad, boxShadow: `0 0 12px ${accent === "electric" ? "var(--electric)" : "var(--emerald-trend)"}` }}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}
