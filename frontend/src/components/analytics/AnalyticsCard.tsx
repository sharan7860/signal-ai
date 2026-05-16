import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/CountUp";

interface AnalyticsCardProps {
  name: string;
  value: string | number;
  state: string;
  desc: string;
  icon: LucideIcon;
  color: "emerald" | "electric" | "red" | "orange" | "cyan";
  loading?: boolean;
  delay?: number;
  percentage?: number;
}

export function AnalyticsCard({ 
  name, 
  value, 
  state, 
  desc, 
  icon: Icon, 
  color, 
  loading, 
  delay = 0,
  percentage = 65
}: AnalyticsCardProps) {
  
  const getColors = () => {
    switch (color) {
      case "emerald": return { text: "text-emerald-trend", grad: "var(--gradient-emerald)", glow: "rgba(16, 185, 129, 0.2)" };
      case "electric": return { text: "text-electric", grad: "var(--gradient-electric)", glow: "rgba(139, 92, 246, 0.2)" };
      case "red": return { text: "text-red-400", grad: "linear-gradient(to right, #f87171, #ef4444)", glow: "rgba(239, 68, 68, 0.2)" };
      case "orange": return { text: "text-orange-400", grad: "linear-gradient(to right, #fbbf24, #f59e0b)", glow: "rgba(245, 158, 11, 0.2)" };
      case "cyan": return { text: "text-cyan-400", grad: "linear-gradient(to right, #22d3ee, #06b6d4)", glow: "rgba(6, 182, 212, 0.2)" };
      default: return { text: "text-electric", grad: "var(--gradient-electric)", glow: "rgba(139, 92, 246, 0.2)" };
    }
  };

  const { text, grad, glow } = getColors();

  if (loading) {
    return (
      <div className="glass-card h-48 animate-pulse rounded-2xl p-6" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass-card group relative overflow-hidden rounded-2xl p-6"
    >
      <div 
        className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-50" 
        style={{ background: grad }} 
      />
      
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl glass ${text} relative`}>
          <Icon className="h-5 w-5" />
          <div className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: glow }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={state}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={`text-[10px] font-bold uppercase tracking-widest ${text}`}
          >
            {state}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{name}</div>
        <div className="mt-1 font-display text-3xl font-semibold flex items-baseline gap-1">
          {typeof value === 'number' ? (
             <CountUp to={value} decimals={value % 1 !== 0 ? 1 : 0} />
          ) : (
             value
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={desc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-muted-foreground line-clamp-1"
        >
          {desc}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: grad, boxShadow: `0 0 8px ${glow}` }}
        />
      </div>
    </motion.div>
  );
}
