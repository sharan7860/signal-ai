import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
  animated?: boolean;
}

export function AnimatedSparkline({
  data,
  color = "var(--electric)",
  height = 60,
  fill = true,
  animated = true,
}: Props) {
  if (!data || data.length < 2) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground opacity-20">
        No data
      </div>
    );
  }

  const width = 200;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  
  // Calculate points with safety check
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return [isNaN(x) ? 0 : x, isNaN(y) ? height / 2 : y];
  });

  const path = points.length > 0 
    ? `M ${points[0][0]} ${points[0][1]}` + points.slice(1).map(([x, y]) => ` L ${x} ${y}`).join("")
    : "";
    
  const area = path ? `${path} L ${width} ${height} L 0 ${height} Z` : "";

  const id = useState(() => Math.random().toString(36).slice(2))[0];
  const [drawn, setDrawn] = useState(!animated);
  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setDrawn(true), 50);
      return () => clearTimeout(t);
    }
  }, [animated]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && path && <path d={area} fill={`url(#g-${id})`} />}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: drawn ? 1 : 0 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}
