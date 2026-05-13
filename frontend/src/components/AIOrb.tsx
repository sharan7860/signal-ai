import { motion } from "framer-motion";

export function AIOrb({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Outer rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-glass-border"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{
          borderColor: "oklch(0.85 0.14 188 / 0.3)",
          boxShadow: "0 0 50px oklch(0.85 0.14 188 / 0.4) inset, 0 0 60px oklch(0.85 0.14 188 / 0.4)",
        }}
      >
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-electric shadow-[0_0_20px_var(--electric)]" />
      </motion.div>
      <motion.div
        className="absolute inset-6 rounded-full border"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ borderColor: "oklch(0.78 0.18 155 / 0.35)" }}
      >
        <div className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-trend shadow-[0_0_14px_var(--emerald-trend)]" />
      </motion.div>
      <motion.div
        className="absolute inset-12 rounded-full border"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ borderColor: "oklch(0.91 0.16 185 / 0.4)" }}
      />

      {/* Core */}
      <motion.div
        className="absolute inset-[28%] rounded-full"
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.96 0.04 188), oklch(0.85 0.14 188) 45%, oklch(0.45 0.10 195) 80%)",
          boxShadow:
            "0 0 60px oklch(0.85 0.14 188 / 0.8), 0 0 120px oklch(0.85 0.14 188 / 0.5), inset 0 -10px 30px oklch(0.20 0.05 200 / 0.6)",
        }}
      />
      <motion.div
        className="absolute inset-[40%] rounded-full bg-white/40 blur-md"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
