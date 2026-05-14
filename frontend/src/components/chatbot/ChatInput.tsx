
import React, { useRef, useEffect } from "react";
import { Send, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <div className="relative flex items-end gap-2 p-1">
      <div className="relative flex-1 group">
        {/* Glow effect on focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-electric to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
        
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <Terminal className="h-4 w-4 text-electric/60 mr-3 shrink-0" />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Jarvis..."
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20 resize-none py-1 leading-relaxed"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
          value.trim() && !disabled
            ? "bg-electric text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]"
            : "bg-white/10 text-white/40 grayscale"
        }`}
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
