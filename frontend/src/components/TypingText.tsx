import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypingText({ text, speed = 50, className }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-electric"
      />
    </span>
  );
}
