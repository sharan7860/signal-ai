import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface AlertBellProps {
  count: number;
  onClick: () => void;
  isOpen: boolean;
}

const AlertBell: React.FC<AlertBellProps> = ({ count, onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
        isOpen 
          ? 'bg-electric/20 text-electric shadow-[0_0_30px_rgba(139,92,246,0.3)] ring-1 ring-electric/40' 
          : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10'
      }`}
      aria-label="Toggle notifications"
    >
      <motion.div
        animate={count > 0 && !isOpen ? { 
          rotate: [0, -15, 15, -15, 15, 0],
        } : { rotate: 0 }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5, 
          repeatDelay: 5,
          ease: "easeInOut"
        }}
      >
        <Bell size={24} className={isOpen ? 'drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]' : ''} />
      </motion.div>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-[#0D0D12] shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Hover Pulse Effect */}
      <div className="absolute inset-0 rounded-xl bg-electric/20 scale-110 opacity-0 group-hover:animate-pulse pointer-events-none" />
    </button>
  );
};

export default AlertBell;
