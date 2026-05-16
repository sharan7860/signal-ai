
import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 mb-4"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/20 border border-electric/30">
        <Cpu className="h-4 w-4 text-electric animate-pulse" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            {[0, 0.2, 0.4].map((delay) => (
              <motion.div
                key={delay}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay,
                }}
                className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_8px_rgba(0,242,255,0.8)]"
              />
            ))}
            <span className="ml-2 text-xs font-medium text-electric/80 tracking-wider uppercase">
              Processing Signals...
            </span>
          </div>
          
          {/* Scanning line effect */}
          <motion.div
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-electric/5 to-transparent skew-x-12"
          />
        </div>
      </div>
    </motion.div>
  );
}
