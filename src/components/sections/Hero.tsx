import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Sparkles } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "../MagneticButton";
import { AIOrb } from "../AIOrb";
import { AnimatedSparkline } from "../AnimatedSparkline";

const heroChartData = [42, 45, 41, 48, 52, 49, 56, 54, 60, 58, 65, 63, 70, 68, 76, 72, 80, 78, 85, 90];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pt-32">
      {/* grid */}
      <motion.div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 opacity-50"
        style={{ y, maskImage: "radial-gradient(ellipse 80% 50% at 50% 30%, black, transparent 70%)" }}
      />

      {/* faint chart line behind */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/3 h-72 opacity-30"
        style={{ y }}
      >
        <AnimatedSparkline data={heroChartData} color="oklch(0.7 0.2 245)" height={300} />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-32 pt-12 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-electric" />
            <span className="text-foreground/80">Live AI predictions powered by neural forecasting</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            <span className="text-gradient">Predict Smarter.</span>
            <br />
            <span className="relative">
              Trade Better.
              <motion.span
                className="absolute -inset-x-2 -bottom-2 h-[3px]"
                style={{ background: "var(--gradient-electric)" }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            AI-powered stock analytics, forecasting, and intelligent recommendations — engineered for the next generation of investors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton icon={<ArrowRight className="h-4 w-4" />}>Start Analyzing</MagneticButton>
            <MagneticButton variant="ghost" icon={<Activity className="h-4 w-4 text-electric" />}>
              View Live Predictions
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6"
          >
            {[
              { v: "98.2%", l: "Model Accuracy" },
              { v: "$4.2B", l: "Assets Analyzed" },
              { v: "24/7", l: "Live Inference" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-semibold text-foreground md:text-3xl">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="relative flex items-center justify-center lg:col-span-5"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <AIOrb size={360} />
            </motion.div>

            {/* Floating data chips */}
            <motion.div
              className="glass-card absolute -left-10 top-8 rounded-2xl px-4 py-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="text-xs text-muted-foreground">NVDA · BUY</div>
              <div className="font-display text-lg font-semibold text-emerald-trend">+12.4%</div>
            </motion.div>
            <motion.div
              className="glass-card absolute -right-6 top-1/2 rounded-2xl px-4 py-3"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: 1 }}
            >
              <div className="text-xs text-muted-foreground">Confidence</div>
              <div className="font-display text-lg font-semibold text-electric">94%</div>
            </motion.div>
            <motion.div
              className="glass-card absolute -bottom-2 left-1/4 rounded-2xl px-4 py-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
            >
              <div className="text-xs text-muted-foreground">Sentiment</div>
              <div className="font-display text-lg font-semibold text-foreground">Bullish</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
