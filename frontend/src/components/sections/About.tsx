import { motion } from "framer-motion";
import { AIOrb } from "../AIOrb";

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2">
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
            About Signal AI
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            We turn market chaos into <span className="text-gradient">clear signals.</span>
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground sm:text-lg">
            Signal AI brings market history, technical rules and an AI learning assistant into one
            workspace. Projections use recent historical returns; they are illustrative baselines,
            not promises of future performance. Portfolio holdings stay in your browser.
          </p>
          <div className="mt-10 grid gap-5 border-t border-glass-border pt-8 sm:grid-cols-3 sm:gap-6">
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
