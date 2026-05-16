import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Monitor, Heart, Landmark, ShoppingBag, MessageSquare, Zap, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";

const sectorIcons: Record<string, any> = {
  "Technology": Monitor,
  "Healthcare": Heart,
  "Financial Services": Landmark,
  "Consumer Cyclical": ShoppingBag,
  "Communication Services": MessageSquare,
  "Energy": Zap,
  "Other": Activity,
};

interface AllocationChartProps {
  allocation: any[];
  watchlistCount: number;
}

export function AllocationChart({ allocation, watchlistCount }: AllocationChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const size = 180;
  const thickness = 12; // Reduced by 25% from 16
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="glass-card relative overflow-hidden rounded-3xl p-7 h-full group"
    >
      {/* Animated Background Glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-electric/5 blur-3xl group-hover:bg-electric/10 transition-colors duration-700" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Allocation Distribution</div>
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
           <PieChart className="h-3.5 w-3.5 text-electric" />
        </div>
      </div>
      
      <div className="relative flex items-center justify-center mb-10">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            stroke="rgba(255,255,255,0.03)"
          />
          {allocation.map((s, i) => {
            const len = (s.pct / 100) * circ;
            const dasharray = `${len} ${circ - len}`;
            const dashoffset = -offsetAcc;
            offsetAcc += len;
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <motion.circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={isHovered ? thickness + 2 : thickness}
                stroke={s.color}
                strokeLinecap="round"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                    pathLength: 1, 
                    opacity: isDimmed ? 0.3 : 1,
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ 
                    pathLength: { duration: 1.5, ease: "easeOut" },
                    opacity: { duration: 0.3 },
                    scale: { type: "spring", stiffness: 300, damping: 20 }
                }}
                style={{ 
                    filter: isHovered ? `drop-shadow(0 0 8px ${s.color})` : `drop-shadow(0 0 2px ${s.color}44)`,
                    cursor: 'pointer'
                }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {hoveredIndex === null ? (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-center"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Holdings</div>
                <div className="font-display text-3xl font-bold text-foreground">{watchlistCount}</div>
                <div className="text-[8px] font-bold text-emerald-trend mt-0.5 uppercase">+2 THIS WEEK</div>
              </motion.div>
            ) : (
              <motion.div
                key="hovered"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center px-4"
              >
                <div className="text-[9px] uppercase font-bold text-electric tracking-widest truncate">{allocation[hoveredIndex].label}</div>
                <div className="text-2xl font-display font-bold mt-0.5">{allocation[hoveredIndex].pct}%</div>
                <div className="text-[8px] font-medium text-muted-foreground uppercase mt-1">Sentiment: Bullish</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        {allocation.map((a, i) => {
          const Icon = sectorIcons[a.label] || sectorIcons["Other"];
          const isHovered = hoveredIndex === i;

          return (
            <motion.div 
              key={a.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group/row flex flex-col gap-2 p-3 rounded-xl transition-all duration-300 border border-transparent ${isHovered ? 'bg-white/5 border-white/5 shadow-inner' : 'hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                   <div className={`p-1.5 rounded-lg bg-white/5 transition-colors ${isHovered ? 'bg-electric/10' : ''}`}>
                      <Icon className={`h-3 w-3 ${isHovered ? 'text-electric' : 'text-muted-foreground'}`} />
                   </div>
                   <span className={`text-[11px] font-medium transition-colors ${isHovered ? 'text-foreground' : 'text-foreground/80'}`}>{a.label}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground font-bold">{a.pct}%</span>
              </div>
              
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div
                   initial={{ width: 0 }}
                   whileInView={{ width: `${a.pct}%` }}
                   transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                   className="h-full rounded-full"
                   style={{ 
                     background: `linear-gradient(90deg, ${a.color}88, ${a.color})`,
                     boxShadow: isHovered ? `0 0 10px ${a.color}44` : 'none'
                   }}
                 />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
         <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <Activity className="h-3 w-3 text-electric" />
            Neural Exposure Analysis
         </div>
         <div className="text-[10px] text-foreground/50 leading-relaxed italic">
            "Institutional volume increasing in Technology sectors. Maintain overweight status for Alpha generation."
         </div>
      </div>
    </motion.div>
  );
}
