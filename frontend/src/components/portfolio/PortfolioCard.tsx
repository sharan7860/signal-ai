
import React from "react";
import { motion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { LucideIcon } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  value: number;
  max: number;
  description: string;
  status: string;
  percentage?: string;
  icon: LucideIcon;
  color: "emerald" | "electric" | "purple" | "orange" | "red";
  delay?: number;
}

export function PortfolioCard({
  title,
  value,
  max,
  description,
  status,
  percentage,
  icon: Icon,
  color,
  delay = 0
}: PortfolioCardProps) {
  const getGlowColor = () => {
    switch (color) {
      case "emerald": return "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]";
      case "electric": return "group-hover:shadow-[0_0_30px_-5px_rgba(0,242,255,0.3)]";
      case "purple": return "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]";
      case "orange": return "group-hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]";
      case "red": return "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]";
      default: return "";
    }
  };

  const getTextColor = () => {
    switch (color) {
      case "emerald": return "text-emerald-400";
      case "electric": return "text-electric";
      case "purple": return "text-purple-400";
      case "orange": return "text-orange-400";
      case "red": return "text-red-400";
      default: return "text-white";
    }
  };

  const getBgColor = () => {
    switch (color) {
      case "emerald": return "bg-emerald-500/20";
      case "electric": return "bg-electric/20";
      case "purple": return "bg-purple-500/20";
      case "orange": return "bg-orange-500/20";
      case "red": return "bg-red-500/20";
      default: return "bg-white/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group glass-card relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 ${getGlowColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${getBgColor()}`}>
              <Icon className={`h-5 w-5 ${getTextColor()}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${getTextColor()}`}>
                  {status}
                </span>
                {percentage && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    {percentage}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  <CountUp to={value} />
                </span>
                <span className="text-sm font-medium text-muted-foreground opacity-50">/{max}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / max) * 100}%` }}
                transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeOut" }}
                className={`absolute inset-y-0 left-0 rounded-full ${color === 'electric' ? 'bg-electric' : `bg-${color}-400`}`}
                style={{
                    boxShadow: color === 'electric' ? '0 0 10px rgba(0,242,255,0.5)' : `0 0 10px rgba(var(--${color}-color),0.5)`
                }}
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.03] blur-2xl ${getBgColor()}`} />
    </motion.div>
  );
}
