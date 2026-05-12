import { motion } from "framer-motion";
import { ArrowUp, Brain, Shield, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CountUp } from "../CountUp";
import { CircularProgress } from "../CircularProgress";

const perfData = Array.from({ length: 30 }, (_, i) => ({
  d: i,
  v: 100000 + i * 1200 + Math.sin(i / 3) * 3000 + Math.random() * 1500,
}));

const allocation = [
  { label: "Tech", pct: 42, color: "oklch(0.91 0.16 185)" },
  { label: "Healthcare", pct: 18, color: "oklch(0.78 0.18 155)" },
  { label: "Energy", pct: 14, color: "oklch(0.91 0.16 185)" },
  { label: "Finance", pct: 12, color: "oklch(0.78 0.18 195)" },
  { label: "Consumer", pct: 9, color: "oklch(0.7 0.18 280)" },
  { label: "Cash", pct: 5, color: "oklch(0.6 0.04 250)" },
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
          {/* Performance card */}
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
                <div className="mt-1 font-display text-4xl font-semibold">
                  <CountUp to={142847.92} decimals={2} prefix="$" />
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-emerald-trend">
                  <ArrowUp className="h-4 w-4" /> +<CountUp to={18422.18} decimals={2} prefix="$" /> (14.8%) all-time
                </div>
              </div>
              <div className="flex gap-6">
                <Stat label="Today" prefix="+$" to={1284} />
                <Stat label="7d" prefix="+$" to={3940} />
                <Stat label="30d" prefix="+$" to={9182} />
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
                  <CartesianGrid stroke="oklch(0.85 0.14 188 / 0.06)" vertical={false} />
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

          {/* Allocation + AI Score */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card relative overflow-hidden rounded-3xl p-7"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Asset Allocation</div>
            <div className="mt-4 flex items-center justify-center">
              <CircularProgress
                segments={allocation}
                size={180}
                thickness={14}
                centerLabel="Holdings"
                centerValue="12"
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {allocation.map((a) => (
                <div key={a.label} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }} />
                  <span className="text-foreground/85">{a.label}</span>
                  <span className="ml-auto font-display text-muted-foreground">{a.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Portfolio Score row */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <ScoreCard icon={Brain} label="AI Portfolio Score" value={87} max={100} accent="electric" desc="Strong diversification, healthy momentum exposure." />
          <ScoreCard icon={Shield} label="Risk Resilience" value={72} max={100} accent="emerald" desc="Low drawdown vs S&P over rolling 90 days." />
          <ScoreCard icon={TrendingUp} label="Alpha (30d)" value={64} max={100} accent="electric" desc="Outperforming benchmark by +3.4%." />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, to, prefix }: { label: string; to: number; prefix?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold text-emerald-trend">
        <CountUp to={to} prefix={prefix} />
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  value,
  max,
  desc,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  max: number;
  desc: string;
  accent: "electric" | "emerald";
}) {
  const grad = accent === "electric" ? "var(--gradient-electric)" : "var(--gradient-emerald)";
  const color = accent === "electric" ? "text-electric" : "text-emerald-trend";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card group relative overflow-hidden rounded-3xl p-6"
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" style={{ background: grad }} />
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl glass ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <div className="font-display text-4xl font-semibold">
          <CountUp to={value} />
        </div>
        <div className="text-sm text-muted-foreground">/ {max}</div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: grad, boxShadow: `0 0 12px ${accent === "electric" ? "var(--electric)" : "var(--emerald-trend)"}` }}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}
