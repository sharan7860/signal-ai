import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Sparkles } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import { AIOrb } from "@/components/AIOrb";
import { AnimatedSparkline } from "@/components/AnimatedSparkline";
import { CountUp } from "@/components/CountUp";
import { useState, useEffect } from "react";
import { fetchStockQuote } from "@/services/api";
import { fetchAnalytics } from "@/services/analyticsService";

const heroChartData = [42, 45, 41, 48, 52, 49, 56, 54, 60, 58, 65, 63, 70, 68, 76, 72, 80, 78, 85, 90];

export function Hero() {
  const [ticker, setTicker] = useState("NVDA");
  const [predictionData, setPredictionData] = useState<{
    symbol: string;
    change: number;
    confidence: number;
    sentiment: string;
  }>({
    symbol: "NVDA",
    change: 12.4,
    confidence: 94,
    sentiment: "Bullish"
  });

  useEffect(() => {
    const updatePredictions = async () => {
      const target = ticker.trim().toUpperCase() || "NVDA";
      try {
        const [quote, analysis] = await Promise.all([
          fetchStockQuote(target),
          fetchAnalytics(target)
        ]);

        setPredictionData({
          symbol: target,
          change: quote.percentage_change || 0,
          confidence: analysis.tech_score?.value || 50,
          sentiment: analysis.sentiment?.status || "Neutral"
        });
      } catch (e) {
        // Fallback for unknown tickers
        setPredictionData(prev => ({ ...prev, symbol: target, sentiment: "Unknown" }));
      }
    };

    const debounce = setTimeout(updatePredictions, 600);
    const interval = setInterval(updatePredictions, 60000); // 1m refresh

    return () => {
      clearTimeout(debounce);
      clearInterval(interval);
    };
  }, [ticker]);

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
        <AnimatedSparkline data={heroChartData} color="oklch(0.85 0.14 188)" height={300} />
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
            <span className="text-foreground/85">Jarvis Neural Intelligence</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="flex items-center gap-1 text-electric"><Sparkles className="h-3 w-3" /> System v5.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] md:text-6xl lg:text-[4.5rem]"
          >
            <span className="text-foreground/90">Beyond Predictions.</span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-electric to-purple-500 animate-gradient-x drop-shadow-[0_0_25px_rgba(139,92,246,0.35)]">
                Intelligent Recommendations.
              </span>
              <motion.span
                className="absolute -inset-x-2 -bottom-1 h-[3px] rounded-full"
                style={{ background: "var(--gradient-electric)", boxShadow: "0 0 30px oklch(0.85 0.14 188 / 0.8)" }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground/80 md:text-xl"
          >
            AI-powered market intelligence that transforms signals into smarter investment decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 flex max-w-sm items-center gap-3"
          >
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-electric to-purple-600 opacity-20 blur group-focus-within:opacity-40 transition duration-500" />
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter ticker (e.g. AAPL)"
                onFocus={(e) => e.currentTarget.select()}
                className="relative w-full rounded-xl border border-white/10 bg-slate-950/50 px-5 py-4 text-sm font-medium text-white placeholder:text-white/20 focus:border-electric/50 focus:outline-none focus:ring-0 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Neural</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Start Analyzing
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' })}
              variant="ghost"
              icon={<Sparkles className="h-4 w-4 text-electric" />}
            >
              Live AI Insights
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
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{predictionData.symbol} · {predictionData.sentiment === "Bullish" ? "BUY" : "HOLD"}</div>
              <div className={`font-display text-lg font-semibold ${predictionData.change >= 0 ? "text-emerald-trend" : "text-rose-500"}`}>
                {predictionData.change >= 0 ? "+" : ""}{predictionData.change.toFixed(1)}%
              </div>
            </motion.div>
            <motion.div
              className="glass-card absolute -right-6 top-1/2 rounded-2xl px-4 py-3"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: 1 }}
            >
              <div className="text-xs text-muted-foreground">Confidence</div>
              <div className="font-display text-lg font-semibold text-electric">{predictionData.confidence}%</div>
            </motion.div>
            <motion.div
              className="glass-card absolute -bottom-2 left-1/4 rounded-2xl px-4 py-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
            >
              <div className="text-xs text-muted-foreground">Sentiment</div>
              <div className={`font-display text-lg font-semibold ${predictionData.sentiment === "Bullish" ? "text-emerald-trend" : "text-foreground"}`}>
                {predictionData.sentiment}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Metric({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold text-foreground md:text-3xl">{children}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
