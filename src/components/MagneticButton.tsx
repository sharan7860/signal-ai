import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
}

export function MagneticButton({
  children,
  onClick,
  variant = "primary",
  className,
  icon,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const tx = useTransform(sx, (v) => v * 0.4);
  const ty = useTransform(sy, (v) => v * 0.4);

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors will-change-transform";
  const styles =
    variant === "primary"
      ? "text-primary-foreground"
      : "text-foreground border border-glass-border glass hover:bg-white/5";

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ x: tx, y: ty }}
      whileTap={{ scale: 0.96 }}
      className={cn(base, styles, className)}
    >
      {variant === "primary" && (
        <>
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--gradient-electric)" }}
          />
          <span
            className="absolute inset-0 rounded-full opacity-70 blur-xl transition-opacity duration-500 hover:opacity-100"
            style={{ background: "var(--gradient-electric)" }}
          />
          <span
            className="absolute inset-0 rounded-full opacity-0 blur-2xl transition-opacity duration-500 hover:opacity-90"
            style={{ background: "radial-gradient(circle, oklch(0.91 0.16 185 / 0.7), transparent 70%)" }}
          />
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute -inset-px rounded-full" style={{ background: "linear-gradient(120deg, transparent 30%, oklch(1 0 0 / 0.35) 50%, transparent 70%)", backgroundSize: "200% 100%", animation: "shimmer 2.8s linear infinite" }} />
          </span>
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </motion.button>
  );
}
