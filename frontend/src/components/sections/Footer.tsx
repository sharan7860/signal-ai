import { motion } from "framer-motion";
import { Activity, Instagram, Github, Linkedin, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";

export function Footer() {
  return (
    <footer className="relative border-t border-glass-border pt-24">
      <div className="mx-auto max-w-7xl px-6 pb-12">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card relative mb-20 overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-electric)" }} />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: "var(--gradient-emerald)" }} />
          <div className="relative">
            <h3 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Get tomorrow's edge,<br /><span className="text-gradient">in your inbox at 6 AM.</span>
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Daily AI Recommendations, market sentiment, and high-conviction setups. Free. No spam.
            </p>
            <form className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@firm.com"
                className="glass w-full flex-1 rounded-full px-6 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <MagneticButton icon={<ArrowRight className="h-4 w-4" />}>Subscribe</MagneticButton>
            </form>
          </div>
        </motion.div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-electric)" }}>
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold">
                TRADER <span className="text-electric">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI-powered stock analytics, forecasting, and intelligent Recommendations for the next generation of investors.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Github, href: "https://github.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
                { Icon: Instagram, href: "https://instagram.com" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full glass text-muted-foreground transition-colors hover:text-electric"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Product" links={["Recommendations", "Analytics", "Insights", "Portfolio"]} />
          <FooterCol title="Company" links={["About", "Careers", "Press", "Contact"]} />
          <FooterCol title="Resources" links={["Docs", "API", "Changelog", "Status"]} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 text-xs text-muted-foreground md:flex-row">
          <div>© 2026 TRADER AI. Not financial advice. Markets carry risk.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-foreground">{title}</div>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="transition-colors hover:text-electric">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
