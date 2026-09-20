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

export type OrderTracking = {
  code: string;
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
