import type { profiles } from "@/lib/db/schema";
import type { ProfileStat, Tone, TraderIdentity } from "@/modules/profile/types";

type Profile = typeof profiles.$inferSelect;

export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Reputation tiers, so the badge tracks the rating instead of being pinned. */
export function ratingTier(rating: number) {
  if (rating >= 4.9) return "Tier-1 Elite";
  if (rating >= 4.5) return "Tier-2 Trusted";
  return "Rising Trader";
}

export function toIdentity(profile: Profile): TraderIdentity {
  return {
    handle: profile.handle,
    realName: profile.realName ?? "",
    alias: profile.alias ?? `@${profile.handle.toLowerCase()}`,
    role: profile.role,
    tier: profile.tier ?? "",
    steamId: profile.steamId ?? "",
    openId: profile.openId ?? "",
    avatar: profile.avatar ?? "/images/lootora/avatar.jpg",
    avatarAlt: profile.avatarAlt ?? `${profile.handle} profile portrait`,
    banner: profile.banner ?? "",
    bannerAlt: profile.bannerAlt ?? "",
    telemetry: (profile.telemetry ?? []) as TraderIdentity["telemetry"],
    ranks: (profile.ranks ?? []) as TraderIdentity["ranks"],
    trust: {
      score: `${profile.trustScore / 10}% TRUST SCORE`,
      trades: `(${profile.tradeCount.toLocaleString("en-US")} TRADES)`,
    },
    tradeUrl: profile.tradeUrl ?? "",
    handshake: profile.handshakeLabel ?? "",
  };
}

type SalesWindow = { cents: number; trades: number; completed: number };

/** The four tiles under the banner: two cached aggregates, two live. */
export function toStats(profile: Profile, sales: SalesWindow): ProfileStat[] {
  const rating = profile.ratingHundredths / 100;
  const change = profile.portfolioChangePercent ?? 0;
  const completion = sales.trades === 0 ? 100 : Math.round((sales.completed / sales.trades) * 100);

  return [
    {
      label: "Portfolio Appraisal",
      icon: "account_balance_wallet",
      tone: "amber",
      value: money(profile.portfolioCents),
      unit: { label: "USD", tone: "amber", bold: true },
      foot: {
        left: `${profile.inventoryCount} Steam items tracked`,
        right: `${change >= 0 ? "+" : ""}${change}% 30d`,
        tone: "amber",
        icon: change >= 0 ? "trending_up" : "trending_down",
      },
    },
    {
      label: "30-Day Sales Volume",
      icon: "bar_chart",
      tone: "crimson",
      value: money(sales.cents),
      unit: { label: "USD", tone: "crimson", bold: true },
      foot: {
        left: `${sales.trades} peer-to-peer trade${sales.trades === 1 ? "" : "s"}`,
        right: `${completion}% completed`,
        tone: "crimson",
      },
    },
    {
      label: "Avg Escrow Dispatch",
      icon: "speed",
      tone: "cyan",
      value: String(profile.fulfillmentSeconds ?? 0),
      unit: { label: "SECONDS", tone: "cyan", mono: true, bold: true },
      foot: { left: "Bot auto-confirmation", right: "Instant Escrow", tone: "cyan" },
    },
    {
      label: "Reputation Rating",
      icon: "star",
      tone: "indigo",
      value: rating.toFixed(2),
      unit: { label: "/ 5.0", tone: "muted" as Tone },
      foot: {
        left: `Based on ${profile.reviewCount} reviews`,
        right: ratingTier(rating),
        tone: "indigo",
      },
    },
  ];
}
