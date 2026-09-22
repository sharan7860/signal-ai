import { motion } from "framer-motion";
import { Brain, BarChart3, MessageSquare, Zap, ShieldAlert, Target } from "lucide-react";
import { TiltCard } from "../TiltCard";

const features = [
  {
    icon: Brain,
    title: "Price Projections",
    body: "Explore a transparent projection based on recent historical returns and volatility.",
  },
  {
    icon: BarChart3,
    title: "Technical Analysis",
    body: "Inspect RSI, MACD and moving averages calculated from the selected stock history.",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    body: "Ask questions about technical indicators, market concepts and diversification.",
  },
  {
    icon: Zap,
    title: "Stock Search",
    body: "Search tickers and refresh the latest available market data with clear timestamps.",
  },
  {
    icon: ShieldAlert,
    title: "Portfolio Tracking",
    body: "Save share quantities in your browser and estimate their current value by currency.",
  },
  {
    icon: Target,
    title: "Explained Signals",
    body: "See which technical rules support each Buy, Hold or Sell signal.",
  },
];

export function Features() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">Capabilities</div>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Built for the <span className="text-gradient">AI-first investor</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="group"
              >
                <TiltCard className="h-full p-7">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{ background: "var(--gradient-electric)" }}
                  >
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
