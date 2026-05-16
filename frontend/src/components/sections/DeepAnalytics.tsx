import { motion } from "framer-motion";
import { Activity, TestTube, BarChart3, LineChart } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DeepAnalyticsProps {
  analytics: any;
  loading: boolean;
}

export function DeepAnalytics({ analytics, loading }: DeepAnalyticsProps) {
  if (loading || !analytics) return null;

  const { adf_test, decomposition } = analytics;
<<<<<<< HEAD
=======
  
  if (!adf_test || !decomposition) {
    return (
      <div className="mt-12 glass-card rounded-3xl p-8 text-center text-muted-foreground">
        Deep technical indicators are currently unavailable for this asset.
      </div>
    );
  }

>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
  const isStationary = adf_test.is_stationary;

  const decompData = decomposition.dates.map((date: string, i: number) => ({
    date,
    observed: decomposition.observed[i],
    trend: decomposition.trend[i],
    seasonal: decomposition.seasonal[i],
    residual: decomposition.residual[i],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Activity className="h-5 w-5 text-electric" />
        <h3 className="font-display text-2xl font-semibold">Technical Deep Dive</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ADF Test Card */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <TestTube className="h-3.5 w-3.5" /> Stationarity Test
          </div>
          <h4 className="mt-4 text-lg font-medium">ADF Result</h4>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Statistic</span>
              <span className="font-mono text-foreground">{adf_test.statistic.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">p-value</span>
              <span className="font-mono text-foreground">{adf_test.p_value.toFixed(4)}</span>
            </div>
          </div>
          <div className={`mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${isStationary ? 'bg-emerald-trend/15 text-emerald-trend' : 'bg-red-trend/15 text-red-trend'}`}>
            {isStationary ? 'Stationary ✅' : 'Non-Stationary ❌'}
          </div>
        </div>

        {/* Decomposition Insights */}
        <div className="glass-card col-span-2 rounded-3xl p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" /> Decomposition Trend
          </div>
          <div className="mt-6 h-[200px] w-full">
            <ResponsiveContainer>
              <RechartsLineChart data={decompData}>
                <CartesianGrid stroke="oklch(0.85 0.14 188 / 0.05)" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.028 254 / 0.95)",
                    border: "1px solid oklch(0.85 0.14 188 / 0.3)",
                    borderRadius: 12,
                    backdropFilter: "blur(16px)",
                  }}
                />
                <Line type="monotone" dataKey="trend" stroke="oklch(0.85 0.14 188)" strokeWidth={2} dot={false} name="Trend" />
                <Line type="monotone" dataKey="observed" stroke="oklch(0.97 0.01 240)" strokeWidth={1} strokeOpacity={0.5} dot={false} name="Observed" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            The trend component highlights the long-term price direction, while removing seasonal noise and residuals.
          </p>
        </div>
      </div>

      {/* Subplots - Seasonal & Residual */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
         <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
               <LineChart className="h-3.5 w-3.5" /> Seasonality (30d Period)
            </div>
            <div className="mt-4 h-[150px] w-full">
               <ResponsiveContainer>
                  <RechartsLineChart data={decompData}>
                     <XAxis dataKey="date" hide />
                     <YAxis hide domain={['auto', 'auto']} />
                     <Line type="monotone" dataKey="seasonal" stroke="oklch(0.78 0.18 155)" strokeWidth={1.5} dot={false} />
                  </RechartsLineChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
               <LineChart className="h-3.5 w-3.5" /> Residual (Noise)
            </div>
            <div className="mt-4 h-[150px] w-full">
               <ResponsiveContainer>
                  <RechartsLineChart data={decompData}>
                     <XAxis dataKey="date" hide />
                     <YAxis hide domain={['auto', 'auto']} />
                     <Line type="monotone" dataKey="residual" stroke="oklch(0.7 0.21 22)" strokeWidth={1.5} dot={false} />
                  </RechartsLineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
