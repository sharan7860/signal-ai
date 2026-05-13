import { motion } from "framer-motion";
import { Brain, BarChart3, MessageSquare, Zap, ShieldAlert, Target } from "lucide-react";
import { TiltCard } from "../TiltCard";

const features = [
  { icon: Brain, title: "AI Predictions", body: "LSTM and transformer models forecast price action with 94%+ confidence intervals." },
  { icon: BarChart3, title: "Technical Analysis", body: "24 indicators — RSI, MACD, MAs, Bollinger — fused into one verdict." },
  { icon: MessageSquare, title: "Sentiment Engine", body: "Real-time NLP across 4,200 news outlets, filings and social channels." },
  { icon: Zap, title: "Real-Time Insights", body: "Sub-second alerts when models detect regime shifts or breakout patterns." },
  { icon: ShieldAlert, title: "Risk Detection", body: "Volatility, drawdown, and tail-risk scoring for every position you hold." },
  { icon: Target, title: "Smart Recommendations", body: "Personalized Buy/Hold/Sell tailored to your strategy and risk tolerance." },
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
                  <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "var(--gradient-electric)" }}>
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
