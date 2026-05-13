import { motion } from "framer-motion";

/**
 * Soft, premium ambient gradient blobs — adds depth without darkness.
 * Pinned behind content; never blocks interaction.
 */
export function FloatingBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.14 188 / 0.55), transparent 65%)",
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-15%] top-[20%] h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.22 280 / 0.5), transparent 65%)",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[20%] bottom-[-10%] h-[560px] w-[560px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 175 / 0.45), transparent 65%)",
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
