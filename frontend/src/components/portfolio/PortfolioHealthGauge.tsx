import { motion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

export function PortfolioHealthGauge({ score = 87 }: { score?: number }) {
  const strokeWidth = 12;
  const size = 160;
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl h-full overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-6 text-center relative z-10">Portfolio Health</div>
      
      <div className="relative z-10" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#healthGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - progress }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#00f2ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-display font-bold text-gradient">
            <CountUp to={score} />
          </div>
          <div className="text-[10px] font-bold text-emerald-trend uppercase tracking-widest mt-1">Strong</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full relative z-10">
        <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[8px] uppercase text-muted-foreground font-bold">Volatility</div>
          <div className="text-xs font-bold text-foreground mt-0.5">Low</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[8px] uppercase text-muted-foreground font-bold">Concentration</div>
          <div className="text-xs font-bold text-foreground mt-0.5">82/100</div>
        </div>
      </div>
    </div>
  );
}
