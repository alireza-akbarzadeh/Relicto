import type { EscrowBadge, EngineMod, ItemBadge, Offer, RarityVariant } from "../types";

/** Rarity chip colours from the Stitch badges. */
export const RARITY: Record<RarityVariant, string> = {
  arcana: "border border-purple-800/50 bg-purple-950/80 text-pink-300",
  exalted: "border border-amber-800/40 bg-amber-950/80 text-tertiary",
  immortal: "border border-border-subtle bg-surface-container-lowest/90 text-status-upcoming",
  persona: "border border-purple-800/50 bg-purple-950/80 text-pink-300",
  helm: "border border-amber-800/50 bg-amber-950/80 text-tertiary",
  cache: "border border-rose-800/50 bg-rose-950/80 text-primary-fixed",
};

export const BADGE_WEIGHT: Record<ItemBadge["variant"], string> = {
  arcana: "font-label-caps text-[11px] font-bold tracking-wider shadow-sm",
  exalted: "font-label-badge text-[11px] font-bold tracking-wider",
  immortal: "font-label-badge text-[11px] font-semibold",
  persona: "font-label-badge text-[10px] font-bold",
  helm: "font-label-badge text-[10px] font-bold",
  cache: "font-label-badge text-[10px] font-bold",
};

export const ESCROW_TONE: Record<EscrowBadge["tone"], string> = {
  emerald: "text-emerald-400",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
};

export const MOD_TONE: Record<EngineMod["tone"], string> = {
  live: "text-status-live",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
};

/** Seller monogram colours in the offers table. */
export const SELLER_TONE: Record<Offer["seller"]["tone"], string> = {
  emerald: "border border-emerald-500/40 bg-emerald-950/80 text-emerald-400",
  indigo: "border border-indigo-500/40 bg-indigo-950/80 text-indigo-400",
  amber: "border border-amber-500/40 bg-amber-950/80 text-tertiary",
  neutral: "border border-border-subtle bg-surface-container-highest text-text-muted",
};

export const STAT_TONE = {
  primary: "text-text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  emerald: "text-emerald-400",
  crimson: "text-primary",
} as const;
