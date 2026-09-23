import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { JarvisAssistant } from "./JarvisAssistant";
import { fetchAIResponse, type ChatMessageType } from "@/services/aiService";

const STORAGE_KEY = "trader-ai-assistant-messages";
const welcome = (): ChatMessageType => ({
  role: "assistant",
  content:
    "Welcome to Trader AI. Ask about current market data for a ticker such as AAPL, stock analysis, diversification, or technical indicators.",
  timestamp: new Date().toISOString(),
});

function validMessages(value: unknown): value is ChatMessageType[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        typeof message.timestamp === "string" &&
        Number.isFinite(Date.parse(message.timestamp)),
    )
  );
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [ready, setReady] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessageType[]>([]);
  const sendingRef = useRef(false);

  useEffect(() => {
    let initial = [welcome()];
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (validMessages(saved)) initial = saved.slice(-100);
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    messagesRef.current = initial;
    setMessages(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
    } catch {
      /* Chat remains usable without browser storage. */
    }
  }, [messages, ready]);

  useEffect(() => {
    if (isOpen)
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("open-trader-chat", open);
    return () => window.removeEventListener("open-trader-chat", open);
  }, []);

  const handleSend = useCallback(async (value: string) => {
    if (!value.trim() || sendingRef.current) return;
    sendingRef.current = true;
    setError(null);
    const previous = messagesRef.current;
    const next: ChatMessageType[] = [
      ...previous,
      {
        role: "user",
        content: value.trim(),
        timestamp: new Date().toISOString(),
      },
    ];
    messagesRef.current = next;
    setMessages(next);
    setInputText("");
    setIsLoading(true);
    try {
      const content = await fetchAIResponse(next);
      const complete: ChatMessageType[] = [
        ...next,
        {
          role: "assistant",
          content,
          timestamp: new Date().toISOString(),
        },
      ].slice(-100) as ChatMessageType[];
      messagesRef.current = complete;
      setMessages(complete);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to send your message. Please retry.",
      );
      messagesRef.current = previous;
      setMessages(previous);
      setInputText(value);
    } finally {
      sendingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            aria-label="Market Copilot"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="glass-card flex max-h-[calc(100dvh-10rem)] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl bg-slate-950/95 shadow-2xl backdrop-blur-xl sm:w-[420px]"
          >
            <div className="flex items-center justify-between border-b border-cyan-300/15 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-300">Trader AI</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Market Copilot</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded px-3 py-2 text-cyan-100 focus-visible:outline focus-visible:outline-cyan-300"
              >
                ✕
              </button>
            </div>
            <div
              ref={messageListRef}
              role="log"
              aria-label="Conversation"
              aria-live="polite"
              className="chatbot-scroll flex min-h-0 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
            {error && (
              <p
                role="alert"
                className="mx-4 mb-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </p>
            )}
            <div className="border-t border-cyan-300/15 px-4 py-4">
              <ChatInput
                value={inputText}
                onChange={setInputText}
                onSend={() => handleSend(inputText)}
                disabled={isLoading || !ready}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <JarvisAssistant isOpen={isOpen} onToggle={() => setIsOpen((state) => !state)} />
    </div>
  );
}
