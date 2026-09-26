import type { IconName } from "@/components/ui/icon";

export type StepState = "done" | "active" | "queued";

export type EscrowStep = {
  id: string;
  /** "Step 01", or the active step's own label. */
  label: string;
  state: StepState;
  /** Timestamp, or "QUEUED" while pending. */
  stamp: string;
  title: string;
  body: string;
  foot: { icon: IconName; label: string };
};

export type SentinelBot = {
  name: string;
  level: string;
  memberSince: string;
  node: string;
  offerId: string;
};

export type TradeToken = {
  code: string;
  hint: string;
  caution: string;
  /** Deep link opened by the primary CTA. */
  offerUrl: string;
  instructions: { step: string; text: string; strong: string; tail: string }[];
  latency: string;
};

export type TrackedItem = {
  game: string;
  styleNote: string;
  image: string;
  imageAlt: string;
  killsBadge: string;
  variantBadge: string;
  name: string;
  slot: string;
  specs: { label: string; value: string; highlight?: boolean }[];
};

export type OrderSummary = {
  lines: { label: string; value: number; tone: "primary" | "free"; promo?: string }[];
  totalUsd: number;
  totalNote: string;
};

export type Vendor = {
  handle: string;
  tag: string;
  blurb: string;
  avatar: string;
  avatarAlt: string;
  stats: { label: string; value: string; highlight?: boolean }[];
};

/** A run of log text; `tone` lifts identifiers out of the sentence. */
export type LogSegment = { text: string; tone?: "primary" | "amber" | "code" };

export type LogLine = {
  id: string;
  time: string;
  channel: string;
  channelTone: "cyan" | "amber" | "live";
  message: LogSegment[];
  /** The waiting line is highlighted and pulses. */
  active?: boolean;
};

/**
 * Where a peer-to-peer trade stands for the person looking at it, and what
 * they can do next. The seller sends the Steam trade offer; the buyer accepts
 * it in Steam and confirms receipt here.
 */
export type Fulfilment = {
  role: "buyer" | "seller";
  stage: "awaiting-offer" | "offer-sent" | "completed" | "cancelled" | "disputed";
  /** The other side's name. */
  counterparty: string;
  /** Seconds left in the seller's dispatch window, while waiting on them (server-computed, so it hydrates cleanly). */
  secondsLeft: number | null;
  /** The buyer's Steam trade URL — shown to the seller, who sends the offer to it. */
  buyerTradeUrl: string | null;
  /** The sent offer, for the buyer to open in Steam. */
  offerUrl: string | null;
  /** Test mode: the buyer may play the seller's part. */
  canSimulate: boolean;
  /** A Relicto bot is handling this trade, so the bot panel applies instead. */
  bot: boolean;
};

export type OrderTracking = {
  code: string;
  fulfilment?: Fulfilment;
  protocol: string;
  version: string;
  status: string;
  placedAgo: string;
  autoCancelSeconds: number;
  steps: EscrowStep[];
  bot: SentinelBot;
  token: TradeToken;
  guarantee: { title: string; badge: string; amount: string; body: string };
  item: TrackedItem;
  summary: OrderSummary;
  vendor: Vendor;
  telemetry: { node: string; buffer: string; lines: LogLine[] };
};

/* ----------------------------------------------------------------------- */
/* Trade ledger (order history)                                             */
/* ----------------------------------------------------------------------- */

export type OrderFlow = "buy" | "sell" | "liquidate";
export type OrderState = "escrow" | "completed" | "disputed" | "cancelled";
export type OrderGame = "DOTA 2" | "CS2";
export type RowAction = "track" | "receipt" | "inspect" | "inspect-label" | "sell-back" | "fingerprint";

export type LedgerRow = {
  id: string;
  code: string;
  when: string;
  game: OrderGame;
  image: string;
  imageAlt: string;
  /** Corner tag over the thumbnail. */
  tag: { label: string; variant: "indigo" | "amber" | "crimson" };
  itemName: string;
  itemDetail: string;
  flow: OrderFlow;
  flowNote: string;
  party: { icon: IconName; iconTone: "cyan" | "muted" | "amber"; name: string; note: string };
  settlement: { amount: string; tone: "primary" | "amber"; note: string };
  state: OrderState;
  stateLabel: string;
  actions: RowAction[];
};

export type LedgerStat = {
  id: string;
  label: string;
  icon: IconName;
  iconTone: "muted" | "cyan" | "amber";
  value: string;
  unit?: string;
  badge?: string;
  notes: string[];
  noteStrong?: string;
  /** Sparkline path drawn on a 100×24 grid, a full bar, or nothing. */
  spark?: { path: string; tone: "primary" | "amber" };
  bar?: boolean;
};

export type ActiveEscrow = { count: string; step: string; code: string; item: string; href: string };

export type LedgerData = {
  poll: string;
  vault: { label: string; value: string; tier: string };
  stats: LedgerStat[];
  active: ActiveEscrow;
  rows: LedgerRow[];
  total: number;
  pages: number;
  counts: { all: number; purchases: number; sales: number; escrow: number; disputed: number };
};
