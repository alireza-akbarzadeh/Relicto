import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile trader profile (Stitch: "Lootora Mobile — User Profile & Trader Identity"). */

export type Tone = "plain" | "amber" | "cyan" | "crimson" | "indigo" | "muted";

export type TrustStat = {
  label: string;
  value: string;
  tone: Tone;
  /** Trailing chip ("ELITE") or muted unit ("p2p"). */
  suffix?: { text: string; chip: boolean };
  /** Out of five; drawn as stars after the value. */
  rating?: number;
  note: string;
  noteTone: "secondary" | "cyan";
  /** Live dot before the note. */
  live?: boolean;
  truncate?: boolean;
};

export type SecurityCheck = { icon: IconName; tone: Tone; title: string; note: string; status: IconName };

export type ShowcaseCard = {
  id: string;
  slug: string;
  image: string;
  imageAlt: string;
  tag: string;
  tagTone: Tone;
  priceUsd: number;
  name: string;
  detail: string;
  stat: { label: string; value: string; tone: Tone };
  available: boolean;
};

export type QuickLink = {
  id: string;
  href: string;
  icon: IconName;
  tone: Tone;
  title: string;
  note: string;
  badge?: { text: string; style: "cyan-pill" | "plain" | "crimson-pill" };
};

export type ProfileMobile = {
  tier: string;
  role: string;
  ping: string;
  botId: string;
  trust: TrustStat[];
  escrow: { heldUsd: number; pending: string };
  security: { checks: SecurityCheck[]; tradeUrl: string };
  showcase: { total: number; items: ShowcaseCard[] };
  links: QuickLink[];
  savedAccounts: number;
  node: string;
};
