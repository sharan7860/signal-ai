import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "TRADER AI's prediction confidence scores have become the cornerstone of our pre-market briefings. The accuracy is uncanny.",
    name: "Morgan Vasquez",
    role: "PM, Helix Capital",
  },
  {
    quote: "I replaced four separate tools with TRADER AI. The sentiment engine alone is worth more than my Bloomberg terminal.",
    name: "Daniel Cho",
    role: "Quantitative Analyst",
  },
  {
    quote: "The AI explanations turn every recommendation into a teachable moment. My team's intuition has sharpened dramatically.",
    name: "Aisha Rahman",
    role: "Head of Research, Northstar",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-3 text-xs uppercase tracking-widest text-electric">Trusted by professionals</div>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            From hedge funds to <span className="text-gradient">independent quants.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card relative overflow-hidden rounded-3xl p-7"
            >
              <Quote className="h-8 w-8 text-electric/40" />
              <p className="mt-4 text-base leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-glass-border pt-5">
                <div className="grid h-10 w-10 place-items-center rounded-full font-display font-semibold text-primary-foreground" style={{ background: "var(--gradient-electric)" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
