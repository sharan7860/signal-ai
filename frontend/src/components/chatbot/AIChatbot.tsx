
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { JarvisAssistant } from "./JarvisAssistant";
import { sendChatMessage, type ChatMessageType } from "@/services/chatService";
import { Sparkles, X, RotateCcw } from "lucide-react";

const STORAGE_KEY = "jarvis-ai-session-history";
const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    role: "assistant",
    content: "Greetings. I am Jarvis, your AI financial copilot. How can I assist your market analysis today?",
    timestamp: new Date().toISOString(),
  },
];

const SUGGESTED_PROMPTS = [
  "Analyze Tesla stock trend",
  "Top dividend stocks 2026",
  "Explain RSI indicator",
  "Evaluate NVDA risk",
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  // Persistence: Load from Session Storage
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to load chat history");
      }
    }
  }, []);

  const chatbotRef = useRef<HTMLDivElement | null>(null);

  // Persistence: Save to Session Storage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    // Auto-scroll
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Click Outside to Close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Small delay to prevent the opening click from triggering the close
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (text: string = inputText) => {
      const val = text.trim();
      if (!val || isLoading) return;

      setError(null);
      const userMessage: ChatMessageType = {
        role: "user",
        content: val,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsLoading(true);

      try {
        // We pass the full history to the backend for conversational memory
        const currentHistory = [...messages, userMessage];
        const reply = await sendChatMessage(currentHistory);

        const assistantMessage: ChatMessageType = {
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        };

<<<<<<< HEAD
        setMessages((prev) => {
          const next = [...prev, assistantMessage];
          messagesRef.current = next;
          return next;
        });
      } catch (error_) {
        setError("Sorry, I couldn't connect to the AI service. Check your API key and network connection.");
        setMessages((prev) => {
          const next = [
            ...prev,
            {
              role: "assistant" as const,
              content:
                "I couldn't complete your request at this time. Please verify your OpenRouter API key and try again.",
              timestamp: new Date().toISOString(),
            },
          ];
          messagesRef.current = next;
          return next;
        });
=======
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        setError(err.message || "Neural link failure. Retrying...");
>>>>>>> a2d25a3753ea3c26578227d982d2cb63f1489231
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, isLoading, messages]
  );

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div ref={chatbotRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            className="w-[min(calc(100vw-2rem),400px)] overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,242,255,0.1)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-electric to-purple-600 p-[1px]">
                    <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
                      <Sparkles className="h-5 w-5 text-electric" />
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-trend shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Jarvis</h3>
                  <p className="text-[10px] uppercase tracking-widest text-electric font-medium">Neural Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetChat}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                  title="Reset Frequency"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div 
              ref={messageListRef}
              className="chatbot-scroll flex h-[400px] flex-col gap-2 overflow-y-auto px-5 py-6"
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              
              {/* Error State */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-5 pb-2">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-1">Suggested Protocols</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] text-foreground hover:bg-electric/10 hover:border-electric/30 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-white/5 bg-white/5 p-4">
              <ChatInput
                value={inputText}
                onChange={setInputText}
                onSend={() => handleSend()}
                disabled={isLoading}
              />
              <p className="mt-2 text-center text-[8px] uppercase tracking-[0.3em] text-white/20">
                Encrypted Neural Link · Active
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <JarvisAssistant isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-electric text-[10px] font-bold text-black shadow-[0_0_15px_rgba(0,242,255,0.6)]"
          >
            1
          </motion.div>
        )}
      </div>
    </div>
  );
}
