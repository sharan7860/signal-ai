/**
 * Minimal notification sound system for TRADER AI.
 * Uses a synthesized frequency to avoid external dependency on audio files.
 */
export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High A
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15); // Slide to A

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (err) {
    console.error("Audio playback blocked by browser or failed:", err);
  }
};

/**
 * Event-based notification bridge to sync Insights -> Navbar
 */
export const notifyNewSignal = (signal: { id: string; title: string; symbol: string }) => {
  const event = new CustomEvent("trader_ai_new_signal", { detail: signal });
  window.dispatchEvent(event);
};
