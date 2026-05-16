import { motion } from "framer-motion";
import { AIOrb } from "@/components/AIOrb";

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
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">About TRADER AI</div>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            We turn market chaos into <span className="text-gradient">clear signals.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            TRADER AI combines machine learning, predictive analytics and financial intelligence to help investors make informed decisions. Our models train on decades of market data, ingesting news, fundamentals and order flow in real time.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-glass-border pt-8">
            <div>
              <div className="font-display text-3xl font-semibold text-foreground">12M+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Recommendations/day</div>
            </div>
            <div>
              <div className="font-display text-3xl font-semibold text-foreground">8,400</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Symbols tracked</div>
            </div>
            <div>
              <div className="font-display text-3xl font-semibold text-foreground">24/7</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Live inference</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
