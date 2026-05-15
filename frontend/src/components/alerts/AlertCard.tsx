import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  X,
  Clock,
} from 'lucide-react';
import { Alert } from '../../services/alertService';

interface AlertCardProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

const severityConfig = {
  success: {
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.04]',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    accent: 'bg-emerald-500',
    glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]',
  },
  warning: {
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/[0.04]',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    accent: 'bg-amber-500',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]',
  },
  danger: {
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.04]',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    accent: 'bg-red-500',
    glow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.12)]',
  },
  info: {
    border: 'border-electric/20',
    bg: 'bg-electric/[0.04]',
    iconBg: 'bg-electric/10',
    iconColor: 'text-electric',
    accent: 'bg-electric',
    glow: 'group-hover:shadow-[0_0_25px_rgba(139,92,246,0.12)]',
  },
};

const typeIcons: Record<string, React.ReactNode> = {
  RSI: <TrendingDown size={20} />,
  MACD: <TrendingUp size={20} />,
  Sentiment: <Info size={20} />,
  Portfolio: <ShieldAlert size={20} />,
  Risk: <AlertTriangle size={20} />,
  Market: <Zap size={20} />,
  Recommendation: <CheckCircle2 size={20} />,
  Prediction: <TrendingUp size={20} />,
};

const AlertCard: React.FC<AlertCardProps> = ({ alert, onDismiss }) => {
  const style = severityConfig[alert.severity] ?? severityConfig.info;
  const icon = typeIcons[alert.type] ?? <Info size={20} />;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative group rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md ${style.border} ${style.bg} ${style.glow} ${
        alert.read ? 'opacity-40 grayscale-[0.6]' : ''
      }`}
    >
      {/* Unread Indicator Dot */}
      {!alert.read && (
        <span className={`absolute top-6 left-6 -translate-x-full -ml-3 w-1.5 h-1.5 rounded-full ${style.accent} shadow-[0_0_8px_currentColor] animate-pulse`} />
      )}

      <div className="flex items-start gap-5">
        {/* Type Icon Wrapper */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner ${style.iconBg} ${style.iconColor}`}>
          {icon}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              {alert.symbol && alert.symbol !== 'SYSTEM' && (
                <span className="text-xs font-black font-mono text-white px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/5 tracking-[0.1em]">
                  {alert.symbol}
                </span>
              )}
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-70 ${style.iconColor}`}>
                {alert.type}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-mono whitespace-nowrap">
              <Clock size={12} />
              {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
            </div>
          </div>

          <h4 className="text-lg font-bold text-white mb-2 leading-tight tracking-tight group-hover:text-electric transition-colors">
            {alert.title}
          </h4>
          
          <p className="text-sm text-white/50 leading-relaxed font-medium">
            {alert.message}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-2 hover:bg-white/10 rounded-xl text-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          title="Dismiss signal"
        >
          <X size={18} />
        </button>
      </div>

      {/* Hover glow effect background */}
      <div className={`absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-2xl ${style.bg}`} />
    </motion.div>
  );
};

export default AlertCard;
