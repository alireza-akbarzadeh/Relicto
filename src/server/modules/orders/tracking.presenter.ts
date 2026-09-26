import type { IconName } from "@/components/ui/icon";
import type { escrowEvents, orderItems, orders, profiles, tradeOffers } from "@/lib/db/schema";
import type { EscrowStep, OrderTracking } from "@/modules/orders/types";
import { money } from "./orders.presenter";
import { buildTelemetry, CAUTION, confirmSteps, GUARANTEE_BODY, stamp } from "./tracking.copy";

type Order = typeof orders.$inferSelect;
type Line = typeof orderItems.$inferSelect;
type Event = typeof escrowEvents.$inferSelect;
type Offer = typeof tradeOffers.$inferSelect;
type Profile = typeof profiles.$inferSelect;

export type TrackingInput = {
  order: Order;
  line: Line | null;
  gameName: string | null;
  rarity: string | null;
  itemImage: string | null;
  itemImageAlt: string | null;
  events: Event[];
  offer: Offer | null;
  vendor: Profile | null;
};

const PROTOCOL_VERSION = "v4.1.8-node";
const FOOT: Record<number, { icon: IconName; label: string }> = {
  1: { icon: "verified", label: "Ledger Locked" },
  2: { icon: "security", label: "API Integrity 100%" },
  4: { icon: "lock_clock", label: "Pending Acceptance" },
};

const titleCase = (value: string | null) => (value ? value[0].toUpperCase() + value.slice(1) : "");

const minutesAgo = (at: Date, now: Date) => {
  const mins = Math.max(0, Math.round((now.getTime() - at.getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  return `${Math.round(mins / 60)} h ago`;
};

function toStep(event: Event, token: string): EscrowStep {
  const foot = FOOT[event.step] ?? { icon: "phonelink_ring" as IconName, label: `Match Code: ${token}` };

  return {
    id: event.id,
    label: event.state === "active" ? "Awaiting User Confirmation" : `Step ${String(event.step).padStart(2, "0")}`,
    state: event.state,
    stamp: event.state === "done" ? stamp(event.occurredAt) : event.state === "queued" ? "QUEUED" : "",
    title: event.title,
    body: event.body ?? "",
    foot,
  };
}

/** Rebuilds the live-order contract from the escrow record behind it. */
export function toOrderTracking(input: TrackingInput, now = new Date()): OrderTracking {
  const { order, line, offer, vendor } = input;
  const token = offer?.token ?? "—";
  const total = money(order.totalCents);
  const active = input.events.find((e) => e.state === "active");
  const attrs = line?.attributes ?? {};
  const botName = offer?.botName ?? "Relicto Sentinel Bot";

  return {
    code: `#${order.code}`,
    protocol: "Escrow Protocol",
    version: PROTOCOL_VERSION,
    status: active ? `${active.title} (Step ${active.step} of 4)` : "Settled",
    placedAgo: minutesAgo(order.placedAt, now),
    // Time left, not the whole window — and none once an offer is out or the order settled.
    autoCancelSeconds:
      order.state === "escrow" && order.autoCancelSeconds && !offer
        ? Math.max(0, Math.round((order.placedAt.getTime() + order.autoCancelSeconds * 1000 - now.getTime()) / 1000))
        : 0,
    steps: input.events.map((event) => toStep(event, token)),
    bot: {
      name: botName,
      level: offer?.botLevel ?? "Steam Lvl —",
      memberSince: offer?.botSince ?? "Official Relicto relay",
      node: "Official Relay Node",
      offerId: offer?.steamOfferId ? `#${offer.steamOfferId}` : "—",
    },
    token: {
      code: token.split("-").join(" - "),
      hint: "Verify this exact code matches your Steam Mobile Authenticator prompt.",
      caution: CAUTION,
      offerUrl: offer?.offerUrl ?? "https://steamcommunity.com/tradeoffer/",
      instructions: confirmSteps(token),
      latency: offer?.latencyMs ? `${offer.latencyMs}ms` : "—",
    },
    guarantee: {
      title: "100% Escrow Guarantee",
      badge: "Zero Risk",
      amount: `${total} USD`,
      body: GUARANTEE_BODY,
    },
    item: {
      game: [input.gameName, titleCase(input.rarity)].filter(Boolean).join(" ") || "Steam Item",
      styleNote: attrs.styleNote ?? (line?.float ? `Float ${line.float}` : ""),
      image: input.itemImage ?? "",
      imageAlt: input.itemImageAlt ?? line?.nameSnapshot ?? "Traded item",
      killsBadge: attrs.killsBadge ?? "",
      variantBadge: attrs.variantBadge ?? "",
      name: line?.detailSnapshot?.split(" (")[0] ?? line?.nameSnapshot ?? "",
      slot: attrs.slotLabel ?? "",
      specs: attrs.specs ?? [],
    },
    summary: {
      lines: [
        { label: "Item Listed Value", value: order.subtotalCents / 100, tone: "primary" },
        {
          label: "Relicto Escrow Protocol Fee",
          value: order.feeCents / 100,
          tone: order.feeCents === 0 ? "free" : "primary",
          ...(order.feeCents === 0 ? { promo: "0% PROMO" } : {}),
        },
        { label: "Steam Sync Routing Fee", value: 0, tone: "free" },
      ],
      totalUsd: order.totalCents / 100,
      totalNote: order.fundingLabel ? `${order.fundingLabel} Deducted` : "Deducted",
    },
    vendor: {
      handle: vendor?.handle ?? order.counterpartyName ?? "Relicto",
      tag: vendor?.tier ?? "PRO",
      blurb: vendor?.blurb ?? "Verified Relicto merchant",
      avatar: vendor?.avatar ?? "/images/lootora/avatar.jpg",
      avatarAlt: `${vendor?.handle ?? "Vendor"} merchant avatar`,
      stats: [
        { label: "Fulfillment Avg", value: vendor?.fulfillmentSeconds ? `${vendor.fulfillmentSeconds} Seconds` : "—" },
        {
          label: "Merchant Rating",
          value: vendor ? `${vendor.trustScore / 10}% (${vendor.tradeCount.toLocaleString("en-US")})` : "—",
          highlight: true,
        },
      ],
    },
    telemetry: {
      node: "WS://ESCROW-NODE-04.LIVE",
      buffer: `BUFFER: ${input.events.length}/5 EVT`,
      lines: buildTelemetry({
        code: `#${order.code}`,
        amount: total,
        funding: order.fundingLabel ?? "Steam Wallet",
        botName,
        botSteamId: offer?.botSteamId ?? null,
        offerId: offer?.steamOfferId ?? null,
        token,
        events: input.events,
      }),
    },
  };
}
