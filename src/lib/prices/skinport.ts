import "server-only";

/**
 * Skinport's public market API: every item of one game in a single request,
 * no key. It is cached on their side for five minutes and rate-limited to a
 * handful of calls per five minutes per IP, so the price feed calls it once
 * per game per run. Responses must be requested Brotli-compressed.
 */

export type SkinportQuote = {
  /** Lowest ask right now, in cents; null when nothing is listed. */
  minCents: number | null;
  medianCents: number | null;
  suggestedCents: number | null;
  /** Copies listed at the time of the quote. */
  quantity: number;
};

type Raw = {
  market_hash_name: string;
  min_price: number | null;
  median_price: number | null;
  suggested_price: number | null;
  quantity: number;
};

const cents = (usd: number | null) =>
  usd === null ? null : Math.round(usd * 100);

/** Every item Skinport knows for a Steam app, keyed by Steam market hash name. Null when the call fails. */
export async function fetchSkinportQuotes(
  appId: number,
): Promise<Map<string, SkinportQuote> | null> {
  try {
    const response = await fetch(
      `https://api.skinport.com/v1/items?app_id=${appId}&currency=USD`,
      {
        headers: { "Accept-Encoding": "br" },
        signal: AbortSignal.timeout(30_000),
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const rows = (await response.json()) as Raw[];
    return new Map(
      rows.map((row) => [
        row.market_hash_name,
        {
          minCents: cents(row.min_price),
          medianCents: cents(row.median_price),
          suggestedCents: cents(row.suggested_price),
          quantity: row.quantity,
        },
      ]),
    );
  } catch {
    return null;
  }
}
