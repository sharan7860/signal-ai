
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, TrendingUp, Sparkles, RefreshCcw, Plus, Activity, Bell, Trash2, PieChart, Shield } from "lucide-react";
import { HoldingCard } from "../portfolio/HoldingCard";
import { CountUp } from "@/components/CountUp";
import { CircularProgress } from "@/components/CircularProgress";
import { fetchBatchInfo } from "@/services/api";
import { AllocationChart } from "../portfolio/AllocationChart";

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
      if (watchlist.length === 0) {
        setInfoMap({});
        return;
      }
      setLoading(true);
      try {
        const data = await fetchBatchInfo(watchlist);
        const map: Record<string, any> = {};
        if (data?.info) {
          data.info.forEach((item: any) => {
            map[item.symbol] = item;
          });
        }
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
    <section id="portfolio" className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-electric font-bold">Portfolio Intelligence</div>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            AI-Driven<br /><span className="text-gradient">Portfolio Wealth.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card relative overflow-hidden rounded-3xl p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Active Analysis Watchlist</div>
                <div className="glass flex items-center gap-2 rounded-full px-3 py-1 border border-white/10 focus-within:border-electric/40 transition-colors">
                  <input
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                    placeholder="ADD TICKER..."
                    className="w-24 bg-transparent text-[10px] font-bold outline-none placeholder:text-muted-foreground/50"
                  />
                  <button onClick={addTicker} className="text-electric hover:scale-110 transition-transform">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-8">
                {watchlist.map((sym, i) => (
                  <HoldingCard
                    key={sym}
                    symbol={sym}
                    info={infoMap[sym]}
                    onRemove={removeTicker}
                    delay={i * 0.05}
                  />
                ))}
                {watchlist.length === 0 && (
                  <div className="col-span-full py-10 text-center text-xs text-muted-foreground uppercase tracking-widest opacity-50 border border-dashed border-white/10 rounded-2xl">
                    No active tickers. Add one above.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/5 pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Est. Portfolio Value</div>
                    <div className="flex items-center gap-3">
                      <div className="font-display text-3xl font-bold text-gradient">
                        <CountUp to={142847.92} decimals={2} prefix="$" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Health: 87/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                      <Brain className="h-3 w-3 text-electric" />
                      <div>
                        <div className="text-[8px] uppercase text-muted-foreground font-bold">AI Insight</div>
                        <div className="text-[9px] font-medium">Tech exposure high</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5">
                      <RefreshCcw className="h-3 w-3 text-purple-400" />
                      <div>
                        <div className="text-[8px] uppercase text-muted-foreground font-bold">Rebalance</div>
                        <div className="text-[9px] font-medium">Reduce NVDA -10%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <Stat label="Total Assets" to={watchlist.length} />
                  <Stat label="Sectors" to={new Set(watchlist.map(s => infoMap[s]?.sector)).size} />
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  <Bell className="h-3 w-3 text-electric" />
                  Neural Activity
                </div>
                <div className="flex flex-wrap gap-4">
                  <NeuralLog color="electric" text="NVDA recommendation updated" />
                  <NeuralLog color="purple" text="Risk score improved" />
                  <NeuralLog color="emerald" text="Diversification target met" />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <ScoreCard icon={Brain} label="AI Score" value={87} accent="electric" desc="Strong diversification" />
              <ScoreCard icon={Shield} label="Risk" value={72} accent="emerald" desc="Low drawdown vs S&P" />
              <ScoreCard icon={TrendingUp} label="Alpha" value={64} accent="electric" desc="Outperforming benchmark" />
            </div>
          </div>

          {/* Allocation Panel */}
          <div className="flex flex-col">
            <AllocationChart
              allocation={allocation}
              watchlistCount={watchlist.length}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, to, prefix }: { label: string; to: number; prefix?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
      <div className="font-display text-lg font-semibold text-electric">
        <CountUp to={to} prefix={prefix} />
      </div>
    </div>
  );
}

function NeuralLog({ color, text }: { color: string, text: string }) {
  const colorMap: any = {
    electric: "bg-electric shadow-[0_0_8px_var(--electric)]",
    purple: "bg-purple-400 shadow-[0_0_8px_#A78BFA]",
    emerald: "bg-emerald-trend shadow-[0_0_8px_var(--emerald-trend)]"
  };
  return (
    <div className="flex items-center gap-3 text-[10px] text-foreground/70 group bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl transition-colors hover:bg-white/[0.05]">
      <div className={`h-1.5 w-1.5 rounded-full ${colorMap[color]} group-hover:scale-125 transition-transform`} />
      {text}
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, accent, desc }: any) {
  const color = accent === "electric" ? "text-electric" : "text-emerald-trend";
  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</span>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-2xl font-bold font-display">{value}</span>
        <span className="text-[10px] text-muted-foreground mb-1">/ 100</span>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
