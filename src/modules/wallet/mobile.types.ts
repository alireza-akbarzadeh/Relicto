import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile wallet (Stitch: "Lootora Mobile — Wallet & Instant Cashout"). */

export const ACTIVITY_FILTERS = ["all", "deposits", "escrow", "trades"] as const;
export type ActivityFilter = (typeof ACTIVITY_FILTERS)[number];

export type Tone = "crimson" | "rose" | "amber" | "indigo" | "cyan" | "plain" | "muted" | "error";

export type QuickAction = { id: "deposit" | "cashout" | "send" | "freeze"; label: string; icon: IconName; tone: Tone };

export type LiquidityRail = { id: string; icon: IconName; tone: Tone; title: string; chip: string; chipTone: "crimson" | "indigo" | "muted"; note: string };

export type LedgerEntry = {
  id: string;
  category: Exclude<ActivityFilter, "all">;
  image: string;
  imageAlt: string;
  game?: { label: string; tone: "crimson" | "indigo" };
  title: string;
  status: { label: string; tone: Tone; strong: boolean };
  ref: string;
  refMono: boolean;
  amountUsd: number;
  amountTone: Tone;
  when: string;
  whenTone: "secondary" | "muted";
};

export type WalletMobile = {
  vault: { label: string; keys: string; mode: string };
  changePct: number;
  pnlUsd: number;
  sync: string;
  availableUsd: number;
  escrowUsd: number;
  escrowNote: string;
  actions: QuickAction[];
  rails: LiquidityRail[];
  ledger: { total: number; entries: LedgerEntry[] };
};
