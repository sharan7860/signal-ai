export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-[28px] border border-[rgba(102,252,241,0.12)] bg-slate-950/90 px-4 py-3 shadow-[inset_0_0_18px_rgba(56,189,248,0.18)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800/90 text-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.18)]">
        <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <span className="inline-flex h-2.5 w-2.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-cyan-300" />
        <span className="inline-flex h-2.5 w-2.5 animate-[pulse_1.2s_0.2s_ease-in-out_infinite] rounded-full bg-cyan-300" />
        <span className="inline-flex h-2.5 w-2.5 animate-[pulse_1.2s_0.4s_ease-in-out_infinite] rounded-full bg-cyan-300" />
        <span className="text-slate-400">Trader AI is typing...</span>
      </div>
    </div>
  );
}
