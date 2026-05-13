import { FormEvent, KeyboardEvent } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSend();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!value.trim() || disabled) return;
      onSend();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <label htmlFor="ai-chat-input" className="sr-only">
        Type your message
      </label>
      <input
        id="ai-chat-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "Waiting for AI response..." : "Ask about stocks, trends, or portfolio strategy..."}
        className="min-h-[46px] flex-1 rounded-3xl border border-[rgba(102,252,241,0.18)] bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-80"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="inline-flex h-12 min-w-[48px] items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-white shadow-[0_0_24px_rgba(56,189,248,0.22)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {disabled ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
        ) : (
          <FaPaperPlane className="h-5 w-5" />
        )}
      </button>
    </form>
  );
}
