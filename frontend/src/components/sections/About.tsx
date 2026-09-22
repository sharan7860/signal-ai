import { motion } from "framer-motion";
import { AIOrb } from "../AIOrb";

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <AIOrb size={320} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">
            About TRADER AI
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            We turn market chaos into <span className="text-gradient">clear signals.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            TRADER AI brings market history, technical rules and an AI learning assistant into one
            workspace. Projections use recent historical returns; they are illustrative baselines,
            not promises of future performance. Portfolio holdings stay in your browser.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-glass-border pt-8">
            <div>
              <div className="font-display text-3xl font-semibold text-foreground">6</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                Indicators
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-semibold text-foreground">30</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                Projection weekdays
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-semibold text-foreground">Local</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                Portfolio storage
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
