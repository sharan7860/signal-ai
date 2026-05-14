
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Cpu } from "lucide-react";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp?: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const time = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, x: isAssistant ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full gap-3 ${isAssistant ? "justify-start" : "justify-end"} mb-4`}
    >
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/20 border border-electric/30">
          <Cpu className="h-4 w-4 text-electric" />
        </div>
      )}

      <div className={`flex max-w-[85%] flex-col gap-1 ${isAssistant ? "items-start" : "items-end"}`}>
        <div
          className={`relative rounded-2xl px-4 py-2.5 text-sm shadow-lg backdrop-blur-md ${
            isAssistant
              ? "bg-white/5 border border-white/10 text-foreground rounded-tl-none"
              : "bg-electric/20 border border-electric/30 text-white rounded-tr-none shadow-[0_0_20px_-5px_rgba(0,242,255,0.2)]"
          }`}
        >
          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Decorative glow for assistant */}
          {isAssistant && (
            <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-electric/10 blur-xl pointer-events-none" />
          )}
        </div>
        
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-tighter px-1">
          {time}
        </span>
      </div>

      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}
