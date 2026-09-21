import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile sniper terminal (Stitch: "Lootora Mobile — Price Alerts & Sniper Bots"). */

export const RULE_FILTERS = ["all", "snipe", "arb"] as const;
export type RuleFilter = (typeof RULE_FILTERS)[number];

export type RuleKind = "snipe" | "dca" | "arb";

export type Tone = "crimson" | "rose" | "amber" | "cyan" | "indigo" | "emerald" | "plain" | "muted" | "lilac";

export type AlertRule = {
  id: string;
  kind: RuleKind;
  game: { label: string; tone: Tone };
  category: { label: string; tone: Tone };
  name: string;
  image: string;
  imageAlt: string;
  armed: boolean;
  target: { label: string; value: string; tone: Tone };
  current: { label: string; value: string; tone: Tone; delta?: string; live?: boolean; bold?: boolean };
  monitor?: { icon: IconName; iconTone: Tone; label: string; labelTone: Tone; spark: string; sparkTone: Tone; stat: string };
  progress?: { label: string; value: string; pct: number };
  tags: { label: string; tone: Tone; icon?: IconName }[];
  ping: string;
};

export type DispatchChannel = { id: string; icon: IconName; tone: Tone; title: string; handle: string; status: string };

export type AlertsMobile = {
  latency: string;
  activeRules: number;
  rulesCapacityPct: number;
  vaultUsd: number;
  poll: string;
  rules: AlertRule[];
  channels: DispatchChannel[];
};
