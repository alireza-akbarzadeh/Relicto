import type { DeliveryMethod, DeliverySla } from "../types/delivery";

export type DeliveryTarget = {
  name?: string;
  subtitle?: string;
  slot?: string;
  badge?: { label: string; style?: string };
  collection?: string | null;
  rarity?: string | null;
  intel?: string[] | null;
  sellerNote?: string | null;
  fulfilment?: string | null;
  tradeLockDays?: number | null;
  deliveryMethod?: DeliveryMethod | null;
};

/**
 * Calculates delivery fulfillment method, SLA time, and requirements (such as
 * Steam's mandatory 30-31 days friendship rule for Collector's Cache gifts).
 */
export function calculateDeliverySla(target: DeliveryTarget): DeliverySla {
  if (target.deliveryMethod) {
    return getMethodSla(target.deliveryMethod, target.tradeLockDays ?? 3);
  }

  const corpus = [
    target.name,
    target.subtitle,
    target.slot,
    target.badge?.label,
    target.collection,
    target.rarity,
    ...(target.intel ?? []),
    target.sellerNote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // 1. Collector's Cache sets, prestige bundles, and giftable-only items (31-day friend hold)
  const isCacheOrGift =
    /\b(collector'?s\s*cache|cache\s*bundle|giftable|gift\s*once|gift\s*delivery|31[\s-]*day|cache\s*set)\b/i.test(
      corpus
    ) ||
    (corpus.includes("cache") && (corpus.includes("bundle") || corpus.includes("set"))) ||
    target.rarity === "cache";

  if (isCacheOrGift) {
    const isBundle = corpus.includes("bundle");
    return {
      method: isBundle ? "bundle_cache" : "gift_cache",
      label: isBundle ? "Sealed Cache Bundle (Gift)" : "Collector's Cache Gift",
      shortBadge: "🎁 31d Friend",
      etaTime: "31 Days (Friend Hold)",
      etaDays: 31,
      tone: isBundle ? "indigo" : "pink",
      icon: isBundle ? "inventory_2" : "card_giftcard",
      description:
        "Giftable Collector's Cache item. Valve Steam policy strictly requires 30-31 days friendship before in-game gifting.",
      warning:
        "⚠️ 31-Day Friend Hold: You and the vendor must be Steam friends for 31 days before gift delivery. Relicto Escrow locks and guarantees your funds for the full 31 days.",
      friendHoldRequired: true,
      escrowGuaranteed: true,
    };
  }

  // 2. Active Trade Cooldown / Lock
  const lockMatch = corpus.match(/(?:trade\s*lock|cooldown|locked\s*for)\s*:?\s*(\d+)\s*d/i);
  const tradeDays = target.tradeLockDays ?? (lockMatch ? Number.parseInt(lockMatch[1], 10) : null);

  if (tradeDays && tradeDays > 0) {
    return {
      method: "trade_cooldown",
      label: "Trade Lock Cooldown",
      shortBadge: `🔒 ${tradeDays}d Lock`,
      etaTime: `${tradeDays} Days`,
      etaDays: tradeDays,
      tone: "amber",
      icon: "lock_clock",
      description: `Item is under Valve's 7-day trade cooldown. Automatically dispatched by bot as soon as lock expires.`,
      warning: `Unlocks in ${tradeDays} days. Relicto Escrow holds your payment securely until delivery.`,
      friendHoldRequired: false,
      escrowGuaranteed: true,
    };
  }

  // 3. P2P Direct Steam Trade
  if (target.fulfilment === "p2p" || /\bp2p\b|peer-to-peer|manual trade/i.test(corpus)) {
    return {
      method: "p2p_trade",
      label: "P2P Direct Steam Trade",
      shortBadge: "🤝 ~15m",
      etaTime: "~15 Minutes",
      etaDays: 0,
      tone: "cyan",
      icon: "swap_horiz",
      description:
        "Direct Steam trade from vendor's personal inventory. Vendor typically accepts and sends trade offer within 15–30 minutes.",
      friendHoldRequired: false,
      escrowGuaranteed: true,
    };
  }

  // 4. Default: Automated 24/7 Relicto Bot Escrow
  return {
    method: "instant_bot",
    label: "Instant Bot Escrow",
    shortBadge: "⚡ < 2m",
    etaTime: "< 2 Minutes",
    etaDays: 0,
    tone: "emerald",
    icon: "bolt",
    description:
      "Automated 24/7 Relicto Steam Bot. Dispatches instant trade offer within 2 minutes of checkout.",
    friendHoldRequired: false,
    escrowGuaranteed: true,
  };
}

function getMethodSla(method: DeliveryMethod, days = 3): DeliverySla {
  switch (method) {
    case "bundle_cache":
      return {
        method: "bundle_cache",
        label: "Sealed Cache Bundle (Gift)",
        shortBadge: "🎁 31d Friend",
        etaTime: "31 Days (Friend Hold)",
        etaDays: 31,
        tone: "indigo",
        icon: "inventory_2",
        description: "Sealed Collector's Cache bundle delivered via 31-day Steam friendship gift.",
        warning: "⚠️ Requires 31 days Steam friendship before delivery under Valve rules.",
        friendHoldRequired: true,
        escrowGuaranteed: true,
      };
    case "gift_cache":
      return {
        method: "gift_cache",
        label: "Collector's Cache Gift",
        shortBadge: "🎁 31d Friend",
        etaTime: "31 Days (Friend Hold)",
        etaDays: 31,
        tone: "pink",
        icon: "card_giftcard",
        description: "Giftable Collector's Cache item delivered via 31-day Steam friendship gift.",
        warning: "⚠️ Requires 31 days Steam friendship before delivery under Valve rules.",
        friendHoldRequired: true,
        escrowGuaranteed: true,
      };
    case "trade_cooldown":
      return {
        method: "trade_cooldown",
        label: "Trade Lock Cooldown",
        shortBadge: `🔒 ${days}d Lock`,
        etaTime: `${days} Days`,
        etaDays: days,
        tone: "amber",
        icon: "lock_clock",
        description: `Valve trade cooldown active. Automated transfer in ${days} days.`,
        friendHoldRequired: false,
        escrowGuaranteed: true,
      };
    case "p2p_trade":
      return {
        method: "p2p_trade",
        label: "P2P Direct Steam Trade",
        shortBadge: "🤝 ~15m",
        etaTime: "~15 Minutes",
        tone: "cyan",
        icon: "swap_horiz",
        description: "Peer-to-peer manual trade offer from seller.",
        friendHoldRequired: false,
        escrowGuaranteed: true,
      };
    case "instant_bot":
    default:
      return {
        method: "instant_bot",
        label: "Instant Bot Escrow",
        shortBadge: "⚡ < 2m",
        etaTime: "< 2 Minutes",
        tone: "emerald",
        icon: "bolt",
        description: "Instant trade offer from Relicto 24/7 automated bot.",
        friendHoldRequired: false,
        escrowGuaranteed: true,
      };
  }
}
