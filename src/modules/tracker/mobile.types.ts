import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile arbitrage terminal (Stitch: "Lootora Mobile — Real-Time Price Tracker"). */

export type FeedTick = { id: string; label: string; tone: "primary" | "secondary" | "muted" | "amber"; priceUsd: number; changePct: number };

export type TrackedAsset = {
  slug: string;
  rarity: string;
  rank: string;
  name: string;
  wear: string;
  image: string;
  imageAlt: string;
  float: string;
  /** Fill of the float meter, in percent. */
  meterPct: number;
  wearBands: string[];
  changePct: number;
};

/** One candle in the 320×110 chart: wick top/bottom and body top/height. */
export type Candle = { x: number; wick: [number, number]; body: [number, number]; tone: "down" | "rise" | "up" | "now" };

export type VolumeBar = { height: number; tone: "down" | "up" | "now"; opacity: number };

export type DopplerPhase = { id: string; label: string; tone: "muted" | "live" | "indigo"; priceUsd: number };

export type DepthLevel = { venue: string; priceUsd: number };

export type ArbQuote = { venue: string; priceUsd: number };

export type ArbCard =
  | { kind: "execute"; id: string; image: string; imageAlt: string; name: string; badge: string; detail: string; net: string; buy: ArbQuote; sell: ArbQuote }
  | { kind: "route"; id: string; image: string; imageAlt: string; name: string; detail: string; net: string; buy: ArbQuote; sell: ArbQuote }
  | { kind: "compact"; id: string; icon: IconName; name: string; detail: string; spread: string; net: string };

export type TrackerMobileData = {
  feed: FeedTick[];
  telemetry: { latency: string; escrow: string; bots: string };
  asset: TrackedAsset;
  chart: { high: number; ema: string; low: number; emaPath: string; candles: Candle[]; volume: VolumeBar[] };
  phases: DopplerPhase[];
  defaultPhase: string;
  depth: { bids: DepthLevel[]; asks: DepthLevel[] };
  arbitrage: { title: string; cards: ArbCard[] };
  relay: { title: string; latency: string; status: string };
};
