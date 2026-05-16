import { motion } from "framer-motion";
import { Bell, Activity, ArrowUpRight, Zap } from "lucide-react";

const activities = [
  { id: 1, type: "update", title: "NVDA recommendation updated", time: "2m ago", icon: Zap, color: "text-electric" },
  { id: 2, type: "risk", title: "Portfolio Risk score changed", time: "15m ago", icon: Activity, color: "text-purple-400" },
  { id: 3, type: "sentiment", title: "Market sentiment improved", time: "45m ago", icon: ArrowUpRight, color: "text-emerald-400" },
  { id: 4, type: "confidence", title: "AI confidence increased to 92%", time: "1h ago", icon: Bell, color: "text-blue-400" },
];

export function ActivityFeed() {
  return (
    <div className="glass-card flex flex-col rounded-2xl h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80">Neural Activity Feed</h3>
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-electric opacity-40" />
          <span className="relative h-2 w-2 rounded-full bg-electric" />
        </span>
      </div>
      
      <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[300px]">
        {activities.map((act, i) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-start gap-3 border-b border-white/5 pb-4 last:border-0"
          >
            <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5 ${act.color}`}>
              <act.icon className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-medium leading-tight text-foreground/90 group-hover:text-electric transition-colors">{act.title}</div>
              <div className="mt-1 text-[9px] text-muted-foreground">{act.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
