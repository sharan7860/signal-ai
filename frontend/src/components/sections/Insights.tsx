import { useQuery } from "@tanstack/react-query";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useMarket } from "@/hooks/use-market";
import { getStockNews } from "@/services/marketService";

function publishedAt(value: string | number | null) {
  if (value === null) return "Time unavailable";
  const date = new Date(typeof value === "number" ? value * 1000 : value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString();
}

export function Insights() {
  const { symbol, data, isPending, error } = useMarket();
  const news = useQuery({
    queryKey: ["stock-news", symbol],
    queryFn: ({ signal }) => getStockNews(symbol, signal),
    staleTime: 20 * 60 * 1000,
    refetchInterval: 20 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
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
                These are transparent technical rules applied to historical prices. Current
                headlines are shown below and are separate from the technical signal.
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
        <div className="glass-card mt-6 rounded-3xl p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Latest market news</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Live provider headlines for {symbol} · refreshes every 20 minutes
              </p>
            </div>
            <button
              onClick={() => void news.refetch()}
              disabled={news.isFetching}
              aria-label="Refresh market news"
              className="rounded-full border border-glass-border p-3 disabled:opacity-50"
            >
              <RefreshCw className={news.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </button>
          </div>
          {news.isPending ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading latest headlines…</p>
          ) : news.error ? (
            <p role="alert" className="mt-6 text-sm text-red-300">
              Live news is temporarily unavailable. Try refreshing shortly.
            </p>
          ) : news.data?.items.length ? (
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {news.data.items.map((article) => (
                <li key={article.id} className="rounded-2xl border border-glass-border bg-slate-950/30 p-4">
                  {article.link ? (
                    <a href={article.link} target="_blank" rel="noreferrer" className="group block">
                      <p className="font-medium group-hover:text-electric">{article.title}</p>
                      <ExternalLink className="mt-3 h-4 w-4 text-electric" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="font-medium">{article.title}</p>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {article.publisher} · {publishedAt(article.published_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No recent provider headlines are available for {symbol}.</p>
          )}
        </div>
      </div>
    </section>
  );
}
