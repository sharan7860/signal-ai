import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Activity, Bell, Trash2, CheckCircle2 } from "lucide-react";
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
  const bg = useTransform(scrollY, [0, 100], ["rgba(15, 15, 20, 0.25)", "rgba(15, 15, 20, 0.85)"]);
  const [active, setActive] = useState<string>("");
  
  // Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Listen for new signals from Insights
    const handleNewSignal = (e: any) => {
      const signal = e.detail;
      setNotifications(prev => [{
        ...signal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      }, ...prev].slice(0, 10)); // Keep last 10
    };

    window.addEventListener("trader_ai_new_signal", handleNewSignal);

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
    return () => {
      obs.disconnect();
      window.removeEventListener("trader_ai_new_signal", handleNewSignal);
    };
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowNotifs(false);
  };

  return (
    <motion.header
      style={{ backdropFilter: useTransform(blur, (b) => `blur(${b}px) saturate(180%)`), background: bg }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
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
                    className="absolute inset-0 -z-0 rounded-full bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                  />
                )}
                <span className={`relative z-10 ${isActive ? "text-foreground" : ""}`}>
                  {l.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/5 ${showNotifs ? 'bg-white/5 text-electric' : 'text-muted-foreground'}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#12121A] shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alerts</span>
                    <div className="flex items-center gap-3">
                       <button onClick={markAllRead} className="text-[10px] text-electric hover:underline">Mark read</button>
                       <button onClick={clearAll} className="text-muted-foreground hover:text-red-400">
                         <Trash2 className="h-3.5 w-3.5" />
                       </button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto chatbot-scroll">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 opacity-40">
                         <Bell className="mb-2 h-8 w-8" />
                         <p className="text-[10px] uppercase tracking-widest">No new alerts</p>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className={`group border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/[0.03] ${!n.read ? 'bg-primary/5' : ''}`}>
                          <div className="flex items-start justify-between gap-2">
                             <div className="flex flex-col">
                                <span className="mb-1 text-[9px] font-bold text-electric uppercase tracking-tighter">{n.symbol}</span>
                                <p className="line-clamp-2 text-xs leading-snug text-foreground/90">{n.title}</p>
                             </div>
                             <span className="shrink-0 text-[9px] text-muted-foreground">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="bg-white/5 px-4 py-2 text-center">
                       <Link 
                        to="/" 
                        onClick={() => setShowNotifs(false)}
                        className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-electric transition-colors"
                       >
                         View all Insights
                       </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 border-l border-white/10 pl-5">
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
      </div>
    </motion.header>
  );
}
