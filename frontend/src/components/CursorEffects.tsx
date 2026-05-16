import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Premium cursor system for TRADER AI:
 *  - Lightweight and elegant
 *  - Soft purple-white glow
 *  - Smooth trailing lag with spring physics
 *  - Gentle expansion on interactive elements
 *  - Minimal pulse on click
 */
export function CursorEffects() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring settings for the "lag" effect
  const springConfig = { stiffness: 250, damping: 30, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Outer glow with more lag for trailing effect
  const glowConfig = { stiffness: 120, damping: 25, mass: 0.8 };
  const glowX = useSpring(mouseX, glowConfig);
  const glowY = useSpring(mouseY, glowConfig);

  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        'button, a, [data-cursor="hover"], input, textarea, [role="button"], .glass-card'
      );
      setHover(isInteractive);
    };

    const onDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 200);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Soft Ambient Glow Trail */}
      <motion.div
        aria-hidden
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}

        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-64 w-64 rounded-full opacity-40 blur-3xl md:block"

        className="pointer-events-none fixed left-0 top-0 z-[1000000] hidden h-64 w-64 rounded-full opacity-40 blur-3xl md:block"

      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(196, 181, 253, 0.1) 40%, transparent 70%)"
          }}
        />
      </motion.div>

      {/* Premium Cursor Outer Ring */}
      <motion.div
        aria-hidden
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}

        className="pointer-events-none fixed left-0 top-0 z-[61] hidden md:block"

        className="pointer-events-none fixed left-0 top-0 z-[1000001] hidden md:block"
      >
        <motion.div
          animate={{
            scale: clicked ? 0.9 : hover ? 1.5 : 1,
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-8 w-8 rounded-full border border-white/20"
          style={{
            background: "rgba(139, 92, 246, 0.03)",
            backdropFilter: "blur(2px)",
            boxShadow: hover
              ? "0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 10px rgba(139, 92, 246, 0.1)"
              : "0 0 10px rgba(255, 255, 255, 0.1)"
          }}
        />
      </motion.div>

      {/* Central Precision Dot */}
      <motion.div
        aria-hidden
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}

        className="pointer-events-none fixed left-0 top-0 z-[62] hidden md:block"

        className="pointer-events-none fixed left-0 top-0 z-[1000002] hidden md:block"
      >
        <motion.div
          animate={{
            scale: clicked ? 0.8 : 1,
          }}
          className="h-1 w-1 rounded-full bg-white shadow-[0_0_10px_rgba(139,92,246,1)]"
        />
      </motion.div>
    </>
  );
}
