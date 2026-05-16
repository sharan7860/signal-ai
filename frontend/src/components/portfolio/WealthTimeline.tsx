import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "00:00", value: 124000 },
  { name: "04:00", value: 126000 },
  { name: "08:00", value: 125500 },
  { name: "12:00", value: 129000 },
  { name: "16:00", value: 132000 },
  { name: "20:00", value: 131500 },
  { name: "23:59", value: 142847 },
];

export function WealthTimeline() {
  const [range, setRange] = useState("1D");

  return (
    <div className="glass-card relative overflow-hidden rounded-3xl p-7 lg:col-span-2 group">
      <div className="absolute inset-0 bg-gradient-to-tr from-electric/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Wealth Progression</div>
          <div className="text-3xl font-display font-bold text-foreground">$142,847.92</div>
        </div>
        
        <div className="flex items-center gap-1 glass p-1 rounded-full border border-white/5">
          {["1D", "1W", "1M", "6M", "1Y"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all ${range === r ? 'bg-electric text-slate-950 shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-[240px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--electric)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--electric)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              hide 
            />
            <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass px-3 py-2 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{payload[0].payload.name}</div>
                      <div className="text-sm font-bold text-electric mt-0.5">${payload[0].value?.toLocaleString()}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--electric)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#wealthGradient)"
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
        <div className="text-[12rem] font-black text-white italic tracking-tighter">WEALTH</div>
      </div>
    </div>
  );
}
