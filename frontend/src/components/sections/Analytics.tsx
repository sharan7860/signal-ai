import { motion } from "framer-motion";
import { AnalyticsGrid } from "../analytics/AnalyticsGrid";

export function Analytics() {
  return (
    <section id="analytics" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-widest text-electric">Deep Analytics</div>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Every signal. <span className="text-gradient">One verdict.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
            We aggregate technical, fundamental and sentiment indicators into a single AI-weighted recommendation pipeline, refreshed in real-time.
          </p>
        </motion.div>

        <AnalyticsGrid />
      </div>
    </section>
  );
}
