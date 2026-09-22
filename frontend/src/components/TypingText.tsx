import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function TypingText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [length, setLength] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    setLength(0);
    if (reducedMotion) return;
    const timer = window.setInterval(
      () => {
        setLength((current) => {
          if (current >= text.length) window.clearInterval(timer);
          return Math.min(current + 1, text.length);
        });
      },
      Math.max(speed, 1),
    );
    return () => window.clearInterval(timer);
  }, [text, speed, reducedMotion]);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reducedMotion ? text : text.slice(0, length)}</span>
    </>
  );
}
