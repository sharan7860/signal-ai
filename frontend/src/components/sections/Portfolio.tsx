import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, TrendingUp, Sparkles, RefreshCcw, Plus, Activity, Bell } from "lucide-react";
import { HoldingCard } from "../portfolio/HoldingCard";
import { CountUp } from "@/components/CountUp";
<<<<<<< HEAD
import { CircularProgress } from "@/components/CircularProgress";
import { useState, useEffect } from "react";
import { fetchBatchInfo } from "@/services/api";
import { Plus, Trash2, PieChart } from "lucide-react";
=======
import { fetchBatchInfo } from "@/services/api";
import { AllocationChart } from "../portfolio/AllocationChart";
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231

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

<<<<<<< HEAD
  // Calculate allocation
=======
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
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

<<<<<<< HEAD
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
=======
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr] items-stretch mb-10">
          {/* Left Panel: Performance & Watchlist */}
          <div className="flex flex-col h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card relative overflow-hidden rounded-3xl p-6 flex flex-col h-full"
            >
               <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Active Analysis Watchlist</div>
                  <div className="glass flex items-center gap-2 rounded-full px-3 py-1 border border-white/10 focus-within:border-electric/40 transition-colors">
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
                      <input 
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && addTicker()}
                        placeholder="ADD TICKER..." 
<<<<<<< HEAD
                        className="w-24 bg-transparent text-[10px] outline-none placeholder:text-muted-foreground"
=======
                        className="w-24 bg-transparent text-[10px] font-bold outline-none placeholder:text-muted-foreground/50"
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
                      />
                      <button onClick={addTicker} className="text-electric hover:scale-110 transition-transform">
                        <Plus className="h-4 w-4" />
                      </button>
<<<<<<< HEAD
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
=======
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-6">
                  {watchlist.map((sym, i) => (
                     <HoldingCard 
                       key={sym} 
                       symbol={sym} 
                       info={infoMap[sym]} 
                       onRemove={removeTicker}
                       delay={i * 0.05}
                     />
                  ))}
               </div>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/5 pt-6">
                <div className="space-y-3">
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
              {/* Neural Activity Section (Moved from Right) */}
              <div className="mt-auto border-t border-white/5 pt-6">
                 <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    <Bell className="h-3 w-3 text-electric" />
                    Neural Activity
                 </div>
                 <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3 text-[10px] text-foreground/70 group bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl transition-colors hover:bg-white/[0.05]">
                       <div className="h-1.5 w-1.5 rounded-full bg-electric group-hover:scale-125 transition-transform shadow-[0_0_8px_var(--electric)]" />
                       NVDA recommendation updated
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-foreground/70 group bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl transition-colors hover:bg-white/[0.05]">
                       <div className="h-1.5 w-1.5 rounded-full bg-purple-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_#A78BFA]" />
                       Risk score improved
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-foreground/70 group bg-white/[0.03] border border-white/5 px-3 py-2 rounded-xl transition-colors hover:bg-white/[0.05]">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-trend group-hover:scale-125 transition-transform shadow-[0_0_8px_var(--emerald-trend)]" />
                       Diversification target met
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Allocation Only */}
          <div className="flex flex-col">
            <AllocationChart 
              allocation={allocation} 
              watchlistCount={watchlist.length} 
            />
          </div>
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
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
