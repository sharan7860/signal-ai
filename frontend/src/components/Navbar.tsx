import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { MagneticButton } from "./MagneticButton";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Predictions", id: "dashboard" },
  { label: "Analytics", id: "analytics" },
  { label: "Insights", id: "insights" },
  { label: "Portfolio", id: "portfolio" },
  { label: "About", id: "about" },
];

export function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [10, 28]);
  const bg = useTransform(scrollY, [0, 100], ["oklch(0.18 0.025 254 / 0.25)", "oklch(0.18 0.025 254 / 0.78)"]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.id))
      .filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

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
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.label}
                href={`#${l.id}`}
                className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                    className="absolute inset-0 -z-0 rounded-full"
                    style={{
                      background: "oklch(0.85 0.14 188 / 0.12)",
                      boxShadow: "inset 0 0 0 1px oklch(0.85 0.14 188 / 0.3)",
                    }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? "text-foreground" : ""}`}>
                  {l.label}
                </span>
                <span
                  className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: "var(--gradient-electric)" }}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <button 
              onClick={loginWithGoogle}
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block"
            >
              Sign in
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || "User"} className="h-7 w-7 rounded-full border border-electric/30" />
              )}
              <button 
                onClick={logout}
                className="hidden text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-electric md:block"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>

  );
}
