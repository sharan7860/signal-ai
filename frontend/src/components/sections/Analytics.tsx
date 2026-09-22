import { useMarket } from "@/hooks/use-market";

export function Analytics() {
  const { symbol, data, isPending, error } = useMarket();
  const indicators = data?.indicators;
  const cards = indicators
    ? [
        { label: "RSI (14)", value: indicators.rsi, detail: "Momentum on a 0–100 scale" },
        {
          label: "MACD",
          value: indicators.macd,
          detail: "12-day minus 26-day exponential average",
        },
        { label: "MACD signal", value: indicators.macd_signal, detail: "9-period MACD average" },
        { label: "MA 20", value: indicators.ma_20, detail: "20-session average close" },
        { label: "MA 50", value: indicators.ma_50, detail: "50-session average close" },
        { label: "MA 200", value: indicators.ma_200, detail: "200-session average close" },
      ]
    : [];
  return (
    <section id="analytics" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-electric">
          Technical analysis · {symbol}
        </p>
        <h2 className="font-display text-4xl font-semibold">
          The numbers behind <span className="text-gradient">the signal.</span>
        </h2>
        {isPending && <p className="mt-6 text-muted-foreground">Loading indicators…</p>}
        {error && (
          <p className="mt-6 text-muted-foreground">
            Indicators unavailable. Retry the stock search above.
          </p>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm text-muted-foreground">{card.label}</h3>
              <p className="mt-3 font-display text-3xl text-electric">
                {card.value?.toFixed(2) ?? "Unavailable"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {card.value === null ? "Not enough price history" : card.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
