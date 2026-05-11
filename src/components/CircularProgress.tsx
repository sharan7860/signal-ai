import { motion } from "framer-motion";

interface Segment {
  label: string;
  pct: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function CircularProgress({
  segments,
  size = 200,
  thickness = 16,
  centerLabel,
  centerValue,
}: Props) {
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          stroke="oklch(0.27 0.03 254 / 0.7)"
        />
        {segments.map((s, i) => {
          const len = (s.pct / 100) * circ;
          const dasharray = `${len} ${circ - len}`;
          const dashoffset = -offsetAcc;
          offsetAcc += len;
          return (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={thickness}
              stroke={s.color}
              strokeLinecap="round"
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.15 + i * 0.1, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centerLabel && (
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {centerLabel}
          </div>
        )}
        {centerValue && (
          <div className="font-display text-2xl font-semibold">{centerValue}</div>
        )}
      </div>
    </div>
  );
}
