import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";
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
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [10, 28]);
  const bg = useTransform(
    scrollY,
    [0, 100],
    ["oklch(0.18 0.025 254 / 0.25)", "oklch(0.18 0.025 254 / 0.78)"],
  );
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

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
      style={{
        backdropFilter: useTransform(blur, (b) => `blur(${b}px) saturate(180%)`),
        background: bg,
      }}
      className="fixed inset-x-0 top-0 z-50 border-b border-glass-border"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href={import.meta.env.BASE_URL} className="flex items-center gap-2.5">
          <div
            className="relative grid h-8 w-8 place-items-center rounded-lg"
            style={{ background: "var(--gradient-electric)" }}
          >
            <Activity className="h-4 w-4 text-primary-foreground" />
            <div
              className="absolute inset-0 rounded-lg opacity-50 blur-md"
              style={{ background: "var(--gradient-electric)" }}
            />
          </div>
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            Signal<span className="text-electric"> AI</span>
          </span>
        </a>

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

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-glass-border text-foreground md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event("open-signal-chat"))}
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block"
          >
            Ask AI
          </button>
          {!loading && !user && (
            <button
              type="button"
              onClick={() => void loginWithGoogle()}
              className="hidden items-center gap-2 rounded-full border border-glass-border px-3 py-2 text-xs text-foreground transition-colors hover:border-electric/60 hover:text-electric md:inline-flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
          )}
          {!loading && user && (
            <button
              type="button"
              onClick={() => void logout()}
              aria-label="Sign out"
              title="Sign out"
              className="hidden items-center gap-2 rounded-full border border-glass-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:border-electric/60 hover:text-electric md:inline-flex"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-6 w-6 rounded-full border border-electric/30"
                />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="hidden lg:inline">Sign out</span>
            </button>
          )}
          <MagneticButton
            onClick={() =>
              document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
            }
            className="!px-4 !py-2.5 text-xs sm:!px-5"
          >
            <span className="sm:hidden">Analyze</span>
            <span className="hidden sm:inline">Analyze stocks</span>
          </MagneticButton>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-glass-border bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-electric/10 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.dispatchEvent(new Event("open-signal-chat"));
              }}
              className="rounded-xl px-4 py-3 text-left text-sm text-electric hover:bg-electric/10"
            >
              Ask AI
            </button>
            {!loading && !user && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void loginWithGoogle();
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-foreground hover:bg-electric/10"
              >
                <LogIn className="h-4 w-4 text-electric" />
                Sign in with Google
              </button>
            )}
            {!loading && user && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-foreground hover:bg-electric/10"
              >
                <LogOut className="h-4 w-4 text-electric" />
                Sign out {user.displayName ? `(${user.displayName})` : ""}
              </button>
            )}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
