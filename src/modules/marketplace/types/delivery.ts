import type { IconName } from "@/components/ui/icon";

export type DeliveryMethod =
  | "instant_bot"
  | "p2p_trade"
  | "trade_cooldown"
  | "gift_cache"
  | "bundle_cache";

export type DeliveryTone = "emerald" | "amber" | "cyan" | "pink" | "indigo";

export type DeliverySla = {
  method: DeliveryMethod;
  label: string;
  shortBadge: string;
  etaTime: string;
  etaDays?: number;
  tone: DeliveryTone;
  icon: IconName;
  description: string;
  warning?: string;
  friendHoldRequired: boolean;
  escrowGuaranteed: boolean;
};

export const DELIVERY_TONE: Record<
  DeliveryTone,
  { badge: string; text: string; bg: string; border: string }
> = {
  emerald: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    text: "text-emerald-400",
    bg: "bg-emerald-950/20",
    border: "border-emerald-500/30",
  },
  amber: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-950/20",
    border: "border-amber-500/30",
  },
  cyan: {
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    text: "text-cyan-400",
    bg: "bg-cyan-950/20",
    border: "border-cyan-500/30",
  },
  pink: {
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    text: "text-rose-400",
    bg: "bg-rose-950/20",
    border: "border-rose-500/30",
  },
  indigo: {
    badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    text: "text-indigo-400",
    bg: "bg-indigo-950/20",
    border: "border-indigo-500/30",
  },
};
