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
          ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      <motion.div
        animate={count > 0 && !isOpen ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 5 }}
      >
        <Bell size={22} className={isOpen ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''} />
      </motion.div>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#0B0F1A] shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Futuristic scanning glow effect */}
      {isOpen && (
        <motion.div
          layoutId="bell-glow"
          className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md -z-10"
        />
      )}
    </button>
  );
};

export default AlertBell;
