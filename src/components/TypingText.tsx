import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
}

export function TypingText({ text, speed = 18, className, startDelay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let raf = 0;
    const start = setTimeout(() => {
      const tick = () => {
        i += 1;
        setShown(text.slice(0, i));
        if (i < text.length) raf = window.setTimeout(tick, speed) as unknown as number;
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(raf);
    };
  }, [inView, text, speed, startDelay]);

  return (
    <span ref={ref} className={className}>
      {shown}
      {shown.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] -mb-[2px] animate-pulse bg-electric align-middle" />
      )}
    </span>
  );
}
