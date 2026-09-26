import type { IconName } from "@/components/ui/icon";

export type TrackerTone = "primary" | "amber" | "cyan" | "muted";
export type TrackerAsset = {
  id: string;
  /** The catalog item behind the board row; focusing it opens its book and chart. */
  slug?: string;
  name: string;
  detail: string;
  image: string;
  price: string;
  change: string;
  tone: TrackerTone;
  icon: IconName;
};
export type SpreadRow = { id: string; asset: string; detail: string; floor: string; steam: string; secondary: string; spread: string; yield: string; tone: TrackerTone };
export type OrderLevel = { price: string; source: string; total: string; side: "buy" | "sell" };

/** One price level of Relicto's own book: listings (asks) or open offers (bids) at that price. */
export type BookLevel = { priceUsd: number; quantity: number };

/** The focus item's live order book, as the stream pushes it. */
export type LiveBook = {
  slug: string;
  /** Cheapest first. */
  asks: BookLevel[];
  /** Highest first. */
  bids: BookLevel[];
  bestAsk: number | null;
  bestBid: number | null;
  spreadUsd: number | null;
  spreadPct: number | null;
  /** Everything listed, at its asking price. */
  depthUsd: number;
  /** When this snapshot was taken (ISO). */
  at: string;
};

/** One observation: epoch ms and dollars. */
export type SeriesPoint = { at: number; price: number };

export type TrackerFocus = { slug: string; name: string; detail: string; image: string; imageAlt: string };

/** Real market data for the focused item. Absent on the sample terminal. */
export type TrackerLive = {
  focus: TrackerFocus;
  book: LiveBook;
  /** Daily lowest Skinport ask, oldest first. */
  series: SeriesPoint[];
  /** Relicto's settled sales. */
  sales: SeriesPoint[];
  stats: { label: string; value: string; tone: "primary" | "cyan" | "amber" | "muted" }[];
};

export type TrackerData = { assets: TrackerAsset[]; spreads: SpreadRow[]; orderBook: OrderLevel[]; chart: number[]; live?: TrackerLive };
