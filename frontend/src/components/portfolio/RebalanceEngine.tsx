import { motion } from "framer-motion";
import { RefreshCcw, ArrowDownRight, ArrowUpRight, Shield } from "lucide-react";

export function RebalanceEngine() {
  return (
    <div className="glass-card flex flex-col rounded-2xl h-full p-6">
      <div className="flex items-center gap-2 mb-6 text-electric">
        <RefreshCcw className="h-4 w-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">AI Rebalancing Engine</h3>
      </div>

      <div className="rounded-xl bg-electric/5 border border-electric/10 p-4 mb-5">
        <div className="text-[10px] text-electric/80 font-bold uppercase tracking-wider mb-1">Status Report</div>
        <div className="text-sm font-display font-medium">Technology Overweight Detected</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-trend/20 text-red-trend">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold">NVDA</div>
              <div className="text-[9px] text-muted-foreground">Reduce Exposure</div>
            </div>
          </div>
          <div className="text-sm font-mono text-red-trend">-10%</div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-trend/20 text-emerald-trend">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold">XLV (Health)</div>
              <div className="text-[9px] text-muted-foreground">Add Sector Exposure</div>
            </div>
          </div>
          <div className="text-sm font-mono text-emerald-trend">+12%</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 text-purple-400" />
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Risk Reduction</span>
          </div>
          <div className="text-sm font-bold text-purple-400">-18.4%</div>
        </div>
      </div>
    </div>
  );
}
