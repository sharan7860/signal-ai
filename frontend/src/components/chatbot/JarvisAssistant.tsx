import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface JarvisAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function JarvisAssistant({ isOpen, onToggle }: JarvisAssistantProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.button
      onClick={onToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.92 }}
      className="group relative h-20 w-20 sm:h-24 sm:w-24 cursor-default focus:outline-none"
      aria-label={isOpen ? "Close Jarvis AI" : "Open Jarvis AI"}
    >
      {/* Outer glow halo */}
      <motion.div
        animate={{
          boxShadow: isHovered
            ? [
                "0 0 40px rgba(56,189,248,0.6)",
                "0 0 60px rgba(56,189,248,0.8)",
                "0 0 40px rgba(56,189,248,0.6)",
              ]
            : ["0 0 30px rgba(56,189,248,0.4)", "0 0 50px rgba(56,189,248,0.6)", "0 0 30px rgba(56,189,248,0.4)"],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent"
      />

      {/* Rotating outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-border opacity-70"
      />

      {/* Secondary rotating ring (counter-clockwise) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-1 rounded-full border-2 border-transparent bg-gradient-to-l from-purple-500 via-cyan-400 to-blue-600 bg-clip-border opacity-50"
      />

      {/* Pulsing energy particles around orb */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            x: [0, Math.cos((i * 120 * Math.PI) / 180) * 25, 0],
            y: [0, Math.sin((i * 120 * Math.PI) / 180) * 25, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
        />
      ))}

      {/* Inner glowing core container */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400/90 via-blue-500/80 to-purple-600/70 shadow-[0_0_30px_rgba(56,189,248,0.5),inset_0_0_20px_rgba(102,252,241,0.3)]"
      />

      {/* Pulsing energy core */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 shadow-[0_0_20px_rgba(56,189,248,0.8),inset_0_0_15px_rgba(255,255,255,0.2)]"
      />

      {/* Central holographic data lines (top-left to bottom-right) */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <defs>
          <linearGradient id="dataLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(102, 252, 241, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" />
          </linearGradient>
        </defs>
        <line x1="20" y1="20" x2="80" y2="80" stroke="url(#dataLineGradient)" strokeWidth="0.5" />
        <line x1="80" y1="20" x2="20" y2="80" stroke="url(#dataLineGradient)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(102, 252, 241, 0.6)" strokeWidth="0.5" />
      </motion.svg>

      {/* Floating motion */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
      >
        {/* Inner accent glow */}
        <motion.div
          animate={{
            boxShadow: isHovered
              ? "0 0 50px rgba(168, 85, 247, 0.6), inset 0 0 20px rgba(102, 252, 241, 0.4)"
              : "0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 15px rgba(102, 252, 241, 0.2)",
          }}
          transition={{ duration: 0.4 }}
          className="h-full w-full rounded-full"
        />
      </motion.div>

      {/* Status indicator text */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/90 px-3 py-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 shadow-lg backdrop-blur-md"
      >
        {isOpen ? "Close" : "Jarvis AI"}
      </motion.div>

      {/* Responsive text inside orb for smaller screens */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: isHovered ? 0.9 : 0.7,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="select-none text-lg font-black text-white drop-shadow-lg sm:text-xl"
        >
          ◆
        </motion.div>
      </div>

      {/* Holographic scan line effect on hover */}
      {isHovered && (
        <motion.div
          initial={{ top: "-100%" }}
          animate={{ top: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-b from-cyan-400 via-transparent to-transparent blur-sm"
        />
      )}
    </motion.button>
  );
}
