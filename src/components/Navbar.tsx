import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

export function Navbar() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [8, 24]);
  const bg = useTransform(scrollY, [0, 100], ["oklch(0.18 0.025 254 / 0.3)", "oklch(0.18 0.025 254 / 0.7)"]);

  const links = [
    { label: "Predictions", href: "#dashboard" },
    { label: "Analytics", href: "#analytics" },
    { label: "Insights", href: "#insights" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
  ];

  return (
    <motion.header
      style={{ backdropFilter: useTransform(blur, (b) => `blur(${b}px) saturate(180%)`), background: bg }}
      className="fixed inset-x-0 top-0 z-50 border-b border-glass-border"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-electric)" }}>
            <Activity className="h-4 w-4 text-primary-foreground" />
            <div className="absolute inset-0 rounded-lg opacity-50 blur-md" style={{ background: "var(--gradient-electric)" }} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            TRADER<span className="text-electric"> AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block">
            Sign in
          </button>
          <MagneticButton className="!px-5 !py-2.5 text-xs">Launch App</MagneticButton>
        </div>
      </div>
    </motion.header>
  );
}
