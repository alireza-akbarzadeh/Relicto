import type { LiveBook, SeriesPoint, TrackerLive } from "@/modules/tracker/types";
import type { PricePointRow } from "../items/items.types";

const DAY = 86_400_000;
const money = (usd: number | null) =>
  usd === null ? "—" : `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Standard deviation of day-over-day returns, as a percentage. Needs three observations to mean anything. */
function volatility(series: SeriesPoint[]) {
  if (series.length < 3) return null;
  const returns = series.slice(1).map((point, index) => (point.price - series[index].price) / series[index].price);
  const mean = returns.reduce((total, r) => total + r, 0) / returns.length;
  const variance = returns.reduce((total, r) => total + (r - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance) * 100;
}

type Focus = { slug: string; name: string; gameId: string; rarity: string | null; imageUrl: string | null; imageAlt: string | null };

/**
 * The terminal's real panels for the focused item: the live book, the daily
 * market series with Relicto's sales on it, and stat tiles computed from both —
 * nothing here is authored.
 */
export function toTrackerLive(focus: Focus, book: LiveBook, history: PricePointRow[], now = new Date()): TrackerLive {
  const point = (row: PricePointRow): SeriesPoint => ({ at: row.recordedAt.getTime(), price: row.priceCents / 100 });
  const series = history.filter((row) => row.venue === "skinport").map(point);
  const sales = history.filter((row) => row.venue === "relicto").map(point);
  const month = series.filter((p) => now.getTime() - p.at <= 30 * DAY);
  const high = month.length ? Math.max(...month.map((p) => p.price)) : null;
  const vol = volatility(month);

  return {
    focus: {
      slug: focus.slug,
      name: focus.name,
      detail: [focus.gameId.toUpperCase(), focus.rarity].filter(Boolean).join(" · "),
      image: focus.imageUrl ?? "",
      imageAlt: focus.imageAlt ?? focus.name,
    },
    book,
    series,
    sales,
    stats: [
      { label: "Best Bid", value: money(book.bestBid), tone: "cyan" },
      { label: "Best Ask", value: money(book.bestAsk), tone: "primary" },
      { label: "30D High", value: money(high), tone: "muted" },
      { label: "Volatility", value: vol === null ? "—" : `${vol.toFixed(1)}%`, tone: "amber" },
    ],
  };
}
