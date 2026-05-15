import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCheck,
  RefreshCw,
  BellOff,
  Zap,
} from 'lucide-react';
import AlertCard from './AlertCard';
import { Alert } from '../../services/alertService';

interface AlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  unreadCount: number;
}

type FilterType = 'All' | 'Unread' | 'RSI' | 'MACD' | 'Risk';

const FILTERS: FilterType[] = ['All', 'Unread', 'RSI', 'MACD', 'Risk'];

const AlertDrawer: React.FC<AlertDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkRead,
  onMarkAllRead,
  onRefresh,
  isLoading,
  unreadCount,
}) => {
  const [filter, setFilter] = React.useState<FilterType>('All');

  const filteredAlerts = React.useMemo(() => {
    switch (filter) {
      case 'Unread': return alerts.filter(a => !a.read);
      case 'RSI': return alerts.filter(a => a.type === 'RSI');
      case 'MACD': return alerts.filter(a => a.type === 'MACD');
      case 'Risk': return alerts.filter(a => a.type === 'Risk' || a.type === 'Portfolio');
      default: return alerts;
    }
  }, [alerts, filter]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--removed-body-scroll-width)';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // ESC Key listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end overflow-hidden">
          {/* Backdrop Overlay with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Side Drawer Panel */}
          <motion.aside
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="relative h-full w-full sm:w-[480px] bg-[#0D0D12] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] flex flex-col border-l border-white/5"
          >
            {/* Left Edge Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-electric/40 to-transparent" />

            {/* HEADER */}
            <div className="flex-shrink-0 p-6 sm:p-8 bg-black/40 border-b border-white/5 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-electric/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-electric/10 border border-electric/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                    <Zap className="text-electric w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-none">Alert Center</h2>
                    <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.25em] mt-1.5">Live AI Signal Engine</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onRefresh}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-electric transition-colors"
                    disabled={isLoading}
                  >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-mono">
                    {unreadCount} NEW SIGNALS
                  </span>
                </div>
                <button 
                  onClick={onMarkAllRead}
                  className="flex items-center gap-2 text-[11px] font-bold text-white/40 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="flex-shrink-0 px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {FILTERS.map(f => {
                const isActive = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      isActive 
                        ? 'bg-electric border-electric text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* NOTIFICATION LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 chatbot-scroll bg-[#0D0D12]">
              <AnimatePresence mode="popLayout">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onDismiss={onMarkRead}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center opacity-30 px-12"
                  >
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center mb-8">
                      <BellOff size={48} className="text-white/40" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No active signals</h3>
                    <p className="text-sm font-mono uppercase tracking-[0.15em]">Monitors are currently scanning...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER */}
            <div className="flex-shrink-0 p-4 border-t border-white/5 bg-black/60 flex items-center justify-between opacity-30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-mono tracking-widest uppercase">System Online // Jarvis AI</span>
              </div>
              <span className="text-[10px] font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

export default AlertDrawer;
