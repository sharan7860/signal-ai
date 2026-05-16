import { motion } from "framer-motion";
import { Bot, Brain, LayoutDashboard, BarChart3, SearchCheck, Target } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";

const features = [
  { icon: Bot, title: "Jarvis AI Assistant", body: "Your 24/7 financial co-pilot for conversational market analysis and automated technical deep-dives." },
  { icon: Brain, title: "AI Recommendation Engine", body: "Multi-layered neural networks generating precision signals based on complex pattern recognition." },
  { icon: LayoutDashboard, title: "Portfolio Intelligence", body: "Dynamic asset tracking with automated health scoring and risk-adjusted performance metrics." },
  { icon: BarChart3, title: "Market Analytics", body: "Institutional-grade technical indicators fused with real-time liquidity and volume profiling." },
  { icon: SearchCheck, title: "Explainable AI (XAI)", body: "Complete transparency into AI logic, revealing the specific indicators and signals driving every verdict." },
  { icon: Target, title: "Decision Support", body: "Transforming raw data into actionable intelligence to help you execute trades with absolute conviction." },
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
