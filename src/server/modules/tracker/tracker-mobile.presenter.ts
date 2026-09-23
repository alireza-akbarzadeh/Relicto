import type { ArbCard, DepthLevel, FeedTick, TrackedAsset, TrackerMobileData } from "@/modules/tracker/mobile.types";
import type { BoardRow, findBook, findFocus, SpreadRow } from "./tracker.repository";
import { toCandleChart } from "./tracker-mobile.chart";

type Book = Awaited<ReturnType<typeof findBook>>;
type Focus = NonNullable<Awaited<ReturnType<typeof findFocus>>>;

const FEED_TONE: Record<string, FeedTick["tone"]> = { primary: "primary", cyan: "secondary", amber: "amber" };
const WEAR = { fn: "Factory New", mw: "Minimal Wear", ft: "Field-Tested", ww: "Well-Worn", bs: "Battle-Scarred" } as const;
/** Float cut-offs of the five exteriors; the meter gives each band an equal fifth. */
const BANDS = [0, 0.07, 0.15, 0.38, 0.45, 1];

const usd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function toFeed(board: BoardRow[]): FeedTick[] {
  return board.map(({ row, name, floorCents, changePercent }) => ({
    id: row.id,
    label: row.label ?? name,
    tone: FEED_TONE[row.tone] ?? "muted",
    priceUsd: floorCents / 100,
    changePct: changePercent,
  }));
}

function meter(float: number) {
  const band = Math.max(0, BANDS.findIndex((edge, i) => float >= edge && float < (BANDS[i + 1] ?? 1.01)));
  const within = (float - BANDS[band]) / (BANDS[band + 1] - BANDS[band]);
  return Math.round((band + within) * 20);
}

export function toAsset({ item, listing }: Focus, authored: TrackedAsset): TrackedAsset {
  const float = listing.float;
  return {
    ...authored,
    slug: item.slug,
    rarity: [item.presentation?.badge.label, item.gameId.toUpperCase()].filter(Boolean).join(" "),
    name: item.name,
    wear: listing.wear ? WEAR[listing.wear] : authored.wear,
    image: listing.imageUrl ?? item.imageUrl ?? authored.image,
    imageAlt: listing.imageAlt ?? item.imageAlt ?? item.name,
    float: float !== null ? float.toFixed(8) : authored.float,
    meterPct: float !== null ? meter(float) : authored.meterPct,
    changePct: listing.changePercent ?? 0,
  };
}

/** Best three bids and the three cheapest asks, straight off the cross-venue book. */
export function toDepth(book: Book): TrackerMobileData["depth"] {
  const level = ({ level: l }: Book[number]): DepthLevel => ({ venue: l.source, priceUsd: l.priceCents / 100 });
  const bids = book.filter((b) => b.level.side === "buy").slice(0, 3).map(level);
  const asks = book.filter((b) => b.level.side === "sell").reverse().slice(0, 3).map(level);
  return { bids, asks };
}

const net = ({ spread }: SpreadRow) => Math.round((spread.secondaryCents - spread.floorCents) * (1 - spread.feeBps / 10000));
const spreadPct = ({ spread }: SpreadRow) => ((spread.secondaryCents - spread.floorCents) / spread.floorCents) * 100;
const quotes = ({ spread }: SpreadRow) => ({
  buy: { venue: "Relicto", priceUsd: spread.floorCents / 100 },
  sell: { venue: spread.secondaryVenue ?? "Secondary", priceUsd: spread.secondaryCents / 100 },
});

/**
 * The matrix leads with the widest spread (the hot flip), then the biggest net
 * loop, then everything else compact. Only rows with item art can take the two
 * picture cards. Same spread rows, same arithmetic as the desktop table.
 */
export function toArbitrage(rows: SpreadRow[]): ArbCard[] {
  const pictured = rows.filter((row) => row.imageUrl);
  const hot = [...pictured].sort((a, b) => spreadPct(b) - spreadPct(a))[0];
  const loop = pictured.filter((row) => row !== hot).sort((a, b) => net(b) - net(a))[0];
  const rest = rows.filter((row) => row !== hot && row !== loop).sort((a, b) => spreadPct(b) - spreadPct(a));

  const cards: ArbCard[] = [];
  if (hot) {
    cards.push({
      kind: "execute", id: hot.spread.id, image: hot.imageUrl!, imageAlt: hot.imageAlt ?? hot.spread.asset,
      name: hot.spread.asset, badge: "HOT ALPHA", detail: hot.spread.detail ?? "", net: `+${usd(net(hot))} Net Flip`, ...quotes(hot),
    });
  }
  if (loop) {
    cards.push({
      kind: "route", id: loop.spread.id, image: loop.imageUrl!, imageAlt: loop.imageAlt ?? loop.spread.asset,
      name: loop.spread.asset, detail: `Relicto → ${quotes(loop).sell.venue} Loop`, net: `+${usd(net(loop))} Net`, ...quotes(loop),
    });
  }
  for (const row of rest) {
    cards.push({
      kind: "compact", id: row.spread.id, icon: "local_fire_department", name: row.spread.asset,
      detail: row.spread.detail ?? "", spread: `+${spreadPct(row).toFixed(1)}% Spread`, net: `+${usd(net(row))} Net`,
    });
  }
  return cards;
}

export { toCandleChart };
