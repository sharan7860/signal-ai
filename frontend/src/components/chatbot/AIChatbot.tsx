import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { JarvisAssistant } from "./JarvisAssistant";
import { fetchAIResponse, type ChatMessageType } from "@/services/aiService";

const STORAGE_KEY = "trader-ai-assistant-messages";
const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    role: "assistant",
    content:
      "Welcome to Trader AI. Ask me about market trends, stock analysis, portfolio allocation, or technical indicators.",
    timestamp: new Date().toISOString(),
  },
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<ChatMessageType[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    if (isOpen) {
      messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as ChatMessageType[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      // ignore parse errors and keep initial state
    }
  }, []);

  const handleSend = useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading) return;
      setError(null);

      const userMessage: ChatMessageType = {
        role: "user",
        content: value.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const next = [...prev, userMessage];
        messagesRef.current = next;
        return next;
      });
      setInputText("");
      setIsLoading(true);

      try {
        const assistantContent = await fetchAIResponse(messagesRef.current);
        const assistantMessage: ChatMessageType = {
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toISOString(),
        };

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
              role: "assistant",
              content:
                "I couldn't complete your request at this time. Please verify your OpenRouter API key and try again.",
              timestamp: new Date().toISOString(),
            },
          ];
          messagesRef.current = next;
          return next;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="w-[min(100vw-2rem,420px)] bg-[rgba(10,12,22,0.82)] backdrop-blur-3xl border border-[rgba(102,252,241,0.14)] shadow-[0_30px_80px_-40px_rgba(56,189,248,0.75)] rounded-[32px] glass-card overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[rgba(102,252,241,0.12)] bg-[rgba(9,11,18,0.72)] px-5 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Trader AI</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Market Copilot</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(56,189,248,0.8)] animate-pulse"></span>
                <span className="text-xs text-cyan-100/80">Online</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-4 py-4 chatbot-scroll max-h-[460px] overflow-y-auto">
              {messages.map((message, index) => (
                <ChatMessage key={`${message.role}-${index}-${message.timestamp}`} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {error ? (
              <div className="mx-4 mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-sm">
                {error}
              </div>
            ) : null}

            <div className="border-t border-[rgba(102,252,241,0.12)] bg-[rgba(7,9,17,0.75)] px-4 py-4">
              <ChatInput
                value={inputText}
                onChange={setInputText}
                onSend={() => handleSend(inputText)}
                disabled={isLoading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <JarvisAssistant isOpen={isOpen} onToggle={() => setIsOpen((state) => !state)} />
    </div>
  );
}
