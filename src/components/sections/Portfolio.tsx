import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const perfData = Array.from({ length: 30 }, (_, i) => ({
  d: i,
  v: 100000 + i * 1200 + Math.sin(i / 3) * 3000 + Math.random() * 1500,
}));

const allocation = [
  { name: "Tech", pct: 42, color: "oklch(0.7 0.18 245)" },
  { name: "Healthcare", pct: 18, color: "oklch(0.78 0.18 155)" },
  { name: "Energy", pct: 14, color: "oklch(0.78 0.22 240)" },
  { name: "Finance", pct: 12, color: "oklch(0.78 0.18 195)" },
  { name: "Consumer", pct: 9, color: "oklch(0.7 0.18 280)" },
  { name: "Cash", pct: 5, color: "oklch(0.6 0.04 250)" },
];

export function Portfolio() {
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden rounded-3xl p-7 lg:col-span-2"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Value</div>
                <div className="mt-1 font-display text-4xl font-semibold">$142,847.92</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-emerald-trend">
                  <ArrowUp className="h-4 w-4" /> +$18,422.18 (14.8%) all-time
                </div>
              </div>
              <div className="flex gap-6">
                <Stat label="Today" value="+$1,284" positive />
                <Stat label="7d" value="+$3,940" positive />
                <Stat label="30d" value="+$9,182" positive />
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer>
                <AreaChart data={perfData}>
                  <defs>
                    <linearGradient id="pg" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 155)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 155)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.7 0.18 245 / 0.06)" vertical={false} />
                  <XAxis dataKey="d" hide />
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.22 0.028 254 / 0.95)",
                      border: "1px solid oklch(0.65 0.1 245 / 0.3)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="oklch(0.78 0.18 155)"
                    strokeWidth={2.5}
                    fill="url(#pg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card relative overflow-hidden rounded-3xl p-7"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Asset Allocation</div>
            <div className="mt-4 space-y-4">
              {allocation.map((a, i) => (
                <div key={a.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-foreground/90">{a.name}</span>
                    <span className="font-display text-foreground">{a.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.pct * 2}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.06, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: a.color, boxShadow: `0 0 12px ${a.color}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-lg font-semibold ${positive ? "text-emerald-trend" : "text-red-trend"}`}>{value}</div>
    </div>
  );
}
