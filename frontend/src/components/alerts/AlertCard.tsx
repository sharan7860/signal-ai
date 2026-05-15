import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle, Info, Zap, X } from 'lucide-react';
import { Alert } from '../../services/alertService';

interface AlertCardProps {
  alert: Alert;
  onRead: (id: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onRead }) => {
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'success': return 'border-green-500/30 bg-green-500/5 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
      case 'danger': return 'border-red-500/30 bg-red-500/5 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
      case 'info': return 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]';
      default: return 'border-gray-500/30 bg-gray-500/5 text-gray-400';
    }
  };

  const getIcon = () => {
    switch (alert.severity) {
      case 'success': return <CheckCircle size={18} />;
      case 'warning': return <AlertCircle size={18} />;
      case 'danger': return <Zap size={18} />;
      case 'info': return <Info size={18} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative p-4 rounded-xl border mb-3 transition-all group hover:scale-[1.02] ${getSeverityStyles()} ${alert.read ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-white/5">{getIcon()}</span>
          <span className="text-xs font-bold tracking-widest uppercase opacity-70">{alert.type}</span>
          {alert.symbol !== 'USER' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono">{alert.symbol}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-50 font-mono">
            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
          </span>
          {!alert.read && (
            <button 
              onClick={() => onRead(alert.id)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Mark as read"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      <h4 className="text-sm font-semibold mb-1">{alert.title}</h4>
      <p className="text-xs leading-relaxed opacity-80">{alert.message}</p>

      {!alert.read && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
      )}
    </motion.div>
  );
};

export default AlertCard;
