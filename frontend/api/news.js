const YAHOO_NEWS_URL = "https://query2.finance.yahoo.com/v1/finance/search";
const CACHE_SECONDS = 20 * 60;

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toArticle(item, symbol, index) {
  const article = asObject(item);
  return {
    id: article.uuid || `${symbol}-${index}`,
    title: article.title || "Market update",
    publisher: article.publisher || "Yahoo Finance",
    link: article.link || null,
    published_at: article.providerPublishTime || null,
    summary: article.summary || "",
    symbol,
  };
}

export default async function handler(request, response) {
  const symbol = String(request.query.symbol || "").trim().toUpperCase();
  if (!/^[A-Z0-9.^=-]{1,20}$/.test(symbol)) {
    return response.status(400).json({ detail: "Provide a valid ticker symbol." });
  }

  try {
    const url = new URL(YAHOO_NEWS_URL);
    url.search = new URLSearchParams({ q: symbol, newsCount: "10", quotesCount: "0" }).toString();
    const upstream = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Signal AI market news service",
      },
    });
    if (!upstream.ok) throw new Error(`Yahoo response ${upstream.status}`);

    const payload = await upstream.json();
    const items = Array.isArray(payload.news) ? payload.news.map((item, index) => toArticle(item, symbol, index)) : [];
    response.setHeader("Cache-Control", `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=60`);
    return response.status(200).json({
      symbol,
      items,
      timestamp: new Date().toISOString(),
      refresh_after_seconds: CACHE_SECONDS,
    });
  } catch (error) {
    console.error("Yahoo news request failed", error);
    return response.status(502).json({ detail: "Live market news is temporarily unavailable. Please try again." });
  }
}
