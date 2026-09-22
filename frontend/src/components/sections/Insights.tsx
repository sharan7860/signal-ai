import { useMarket } from "@/hooks/use-market";

export function Insights() {
  const { symbol, data, isPending, error } = useMarket();
  return (
    <section id="insights" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-electric">
          Stock insights · {symbol}
        </p>
        <h2 className="font-display text-4xl font-semibold">
          A clear view of <span className="text-gradient">the latest signals.</span>
        </h2>
        <div className="glass-card mt-10 rounded-3xl p-7">
          {isPending ? (
            <p>Preparing the analysis…</p>
          ) : error || !data ? (
            <p>Search for a valid ticker above to see its analysis.</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold">
                {symbol}: {data.analysis.recommendation} signal
              </h3>
              <ul className="mt-5 space-y-3 text-muted-foreground">
                {data.analysis.summary.split(" | ").map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                These are transparent technical rules applied to historical prices. They do not
                incorporate current news or your personal portfolio.
              </p>
              <button
                onClick={() => window.dispatchEvent(new Event("open-trader-chat"))}
                className="mt-6 rounded-full bg-electric/15 px-5 py-3 text-sm text-electric"
              >
                Ask the assistant about these indicators
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
