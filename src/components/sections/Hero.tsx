import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Sparkles } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { MagneticButton } from "../MagneticButton";
import { AIOrb } from "../AIOrb";
import { AnimatedSparkline } from "../AnimatedSparkline";
import { CountUp } from "../CountUp";

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
            className="glass mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-trend opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-trend" />
            </span>
            <span className="text-foreground/85">Live AI predictions</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="flex items-center gap-1 text-electric"><Sparkles className="h-3 w-3" /> Neural v4.2</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-6xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-7xl lg:text-[6.5rem]"
          >
            <span className="text-gradient">Predict Smarter.</span>
            <br />
            <span className="relative">
              Trade Better.
              <motion.span
                className="absolute -inset-x-2 -bottom-2 h-[3px] rounded-full"
                style={{ background: "var(--gradient-electric)", boxShadow: "0 0 20px oklch(0.7 0.18 245 / 0.7)" }}
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
            <Metric label="Model Accuracy"><CountUp to={98.2} decimals={1} suffix="%" /></Metric>
            <Metric label="Assets Analyzed"><CountUp to={4.2} decimals={1} prefix="$" suffix="B" /></Metric>
            <Metric label="Live Inference">24<span className="text-electric">/</span>7</Metric>
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
