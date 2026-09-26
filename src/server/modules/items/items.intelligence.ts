import type { ChartAnnotation, PriceIntelligence } from "@/modules/items/types";
import type { PricePointRow } from "./items.types";

const DAY = 86_400_000;
const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (at: Date) => at.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** The last few Relicto sales, pinned on the time axis. */
const SALES_MARKED = 4;

/**
 * The price panel from real observations: the line is the daily market
 * snapshot, Relicto's own sales are marked on it, and every stat says where
 * its number comes from. Also returns the 30-day band the price panel quotes.
 */
export function toIntelligence(history: PricePointRow[], floorCents: number, now = new Date()) {
  const market = history.filter((point) => point.venue === "skinport");
  const sales = history.filter((point) => point.venue === "relicto");
  const recent = market.filter((point) => now.getTime() - point.recordedAt.getTime() <= 30 * DAY);
  const band = recent.map((point) => point.priceCents);
  const low = band.length ? Math.min(...band) : null;
  const high = band.length ? Math.max(...band) : null;
  const latest = market.at(-1);
  const lastSale = sales.at(-1);

  const annotations: ChartAnnotation[] = sales.slice(-SALES_MARKED).map((sale, index) => ({
    id: `sale-${index}-${sale.recordedAt.getTime()}`,
    at: sale.recordedAt.getTime(),
    label: `SOLD ${money(sale.priceCents)}`,
    tone: "cyan",
    title: "Relicto sale",
    detail: date(sale.recordedAt),
    detailTone: "emerald",
  }));

  const intelligence: PriceIntelligence = {
    ranges: ["24H", "7D", "30D", "90D", "1Y", "ALL"],
    activeRange: "30D",
    modes: ["LINE", "CANDLE"],
    activeMode: "LINE",
    points: market.map((point, index) => ({
      at: point.recordedAt.getTime(),
      price: point.priceCents / 100,
      ...(index === market.length - 1 ? { marker: "now" as const } : {}),
    })),
    annotations,
    source: "Daily lowest ask on Skinport, plus sales settled on Relicto.",
    emptyNote: latest
      ? `History starts ${date(latest.recordedAt)} at ${money(latest.priceCents)}. A new market observation is recorded every day.`
      : "No market observations yet — this item isn't traded on Skinport, or the daily price feed hasn't run since it was listed.",
    stats: [
      { label: "Relicto Floor", value: floorCents ? money(floorCents) : "—", note: "lowest active listing", tone: "primary" },
      { label: "Market Ask", value: latest ? money(latest.priceCents) : "—", note: latest ? `Skinport · ${date(latest.recordedAt)}` : "no market quote", tone: "emerald" },
      { label: "30d Range", value: low !== null && high !== null ? `${money(low)} – ${money(high)}` : "—", note: `${recent.length} daily observation${recent.length === 1 ? "" : "s"}`, tone: "amber" },
      { label: "Relicto Sales", value: String(sales.length), note: lastSale ? `last ${money(lastSale.priceCents)} · ${date(lastSale.recordedAt)}` : "none settled yet", tone: "primary" },
    ],
  };

  return { intelligence, low, high };
}
