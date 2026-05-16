import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Sparkles, Trash2 } from "lucide-react";
import { AnimatedSparkline } from "@/components/AnimatedSparkline";

interface HoldingCardProps {
  symbol: string;
  info: any;
  onRemove: (sym: string) => void;
  delay?: number;
}

export function HoldingCard({ symbol, info, onRemove, delay = 0 }: HoldingCardProps) {
  const isPositive = (info?.change || 0) >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass group relative flex flex-col rounded-xl p-3.5 transition-all hover:border-electric/40 hover:shadow-[0_0_20px_-5px_rgba(0,242,255,0.15)]"
    >
      <button 
        onClick={() => onRemove(symbol)}
        className="absolute -right-1.5 -top-1.5 z-20 flex h-5 w-5 scale-0 items-center justify-center rounded-full bg-red-trend/20 text-red-trend opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
      >
        <Trash2 className="h-2.5 w-2.5" />
      </button>

      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-display text-xs font-bold tracking-tight">{symbol}</div>
          <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{info?.sector || '---'}</div>
        </div>
        <div className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? 'text-emerald-trend' : 'text-red-trend'}`}>
          {isPositive ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
          {isPositive ? '+' : ''}{info?.change?.toFixed(1) || '0.0'}%
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 rounded-full bg-white/5 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-electric border border-electric/10">
          <Sparkles className="h-1.5 w-1.5" />
          {info?.recommendation || 'BUY'}
        </div>
        <div className="text-[7px] text-muted-foreground font-mono">
          Conf: {info?.confidence || 87}%
        </div>
      </div>

      {/* Subtle hover sparkline */}
      <div className="absolute inset-x-2 bottom-1 h-0.5 opacity-0 group-hover:opacity-40 transition-opacity">
        <div className={`h-full w-full rounded-full ${isPositive ? 'bg-emerald-trend' : 'bg-red-trend'}`} />
      </div>
    </motion.div>
  );
}
