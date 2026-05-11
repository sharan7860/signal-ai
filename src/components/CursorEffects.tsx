import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Burst {
  id: number;
  x: number;
  y: number;
}

/**
 * Premium cursor system:
 *  - Soft trailing glow that follows the pointer with spring physics
 *  - Crisp inner dot
 *  - Outer ring that expands on interactive elements ([data-cursor="hover"])
 *  - Particle burst on click
 */
export function CursorEffects() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 50, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 50, mass: 0.4 });
  const glowX = useSpring(x, { stiffness: 90, damping: 20 });
  const glowY = useSpring(y, { stiffness: 90, damping: 20 });
  const [hover, setHover] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        'button, a, [data-cursor="hover"], input, textarea, [role="button"]',
      );
      setHover(interactive);
    };
    const onDown = (e: MouseEvent) => {
      const id = ++idRef.current;
      setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 700);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
    };
  }, [x, y]);

  return (
    <>
      {/* Soft glow trail */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[420px] w-[420px] rounded-full opacity-60 blur-3xl md:block"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.2 245 / 0.3), oklch(0.7 0.2 280 / 0.08) 45%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[61] hidden md:block"
      >
        <motion.div
          animate={{
            width: hover ? 56 : 30,
            height: hover ? 56 : 30,
            opacity: hover ? 1 : 0.7,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-full border"
          style={{
            borderColor: "oklch(0.78 0.22 240 / 0.85)",
            boxShadow:
              "0 0 18px oklch(0.7 0.2 245 / 0.55), inset 0 0 12px oklch(0.7 0.2 245 / 0.25)",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[62] hidden md:block"
      >
        <motion.div
          animate={{ scale: hover ? 0.4 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="h-1.5 w-1.5 rounded-full bg-electric"
          style={{ boxShadow: "0 0 12px var(--electric)" }}
        />
      </motion.div>

      {/* Click bursts */}
      {bursts.map((b) => (
        <ClickBurst key={b.id} x={b.x} y={b.y} />
      ))}
    </>
  );
}

function ClickBurst({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[63]"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: "oklch(0.78 0.22 240 / 0.6)" }}
      />
      {particles.map((i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dx = Math.cos(angle) * 32;
        const dy = Math.sin(angle) * 32;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric"
            style={{ boxShadow: "0 0 10px var(--electric)" }}
          />
        );
      })}
    </div>
  );
}
