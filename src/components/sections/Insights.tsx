import { motion } from "framer-motion";
import { Sparkles, Newspaper, Rocket, Lightbulb } from "lucide-react";

const insights = [
  {
    icon: Sparkles,
    tag: "Daily Insight",
    title: "Semiconductor sector entering accumulation phase",
    body: "AI models detect institutional accumulation across NVDA, AMD, and AVGO with combined confidence of 91%.",
  },
  {
    icon: Newspaper,
    tag: "News Sentiment",
    title: "Fed dovish pivot drives tech rally",
    body: "Sentiment shift across 4,200 news sources turned positive (+0.68) following yesterday's FOMC minutes.",
  },
  {
    icon: Rocket,
    tag: "Top Predicted Growth",
    title: "5 stocks projected to outperform S&P by 18%+",
    body: "PLTR, SMCI, MELI, CRWD, NOW lead our 30-day forecast leaderboard with sustained momentum signals.",
  },
  {
    icon: Lightbulb,
    tag: "AI Suggestion",
    title: "Rebalance exposure toward defensive growth",
    body: "Current portfolio drift suggests reducing high-beta exposure by 12% and reallocating to quality compounders.",
  },
];

export function Insights() {
  return (
    <section id="insights" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">AI Insights</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Daily intelligence,<br />
            <span className="text-gradient">delivered before the open.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {insights.map((ins, i) => {
            const Icon = ins.icon;
            return (
              <motion.div
                key={ins.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card group relative overflow-hidden rounded-3xl p-7"
              >
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40" style={{ background: "var(--gradient-electric)" }} />
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: "var(--gradient-electric)" }}>
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-electric">{ins.tag}</div>
                    <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight">{ins.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ins.body}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
