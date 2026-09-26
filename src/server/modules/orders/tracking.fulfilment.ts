import type { Fulfilment } from "@/modules/orders/types";
import type { TrackingInput } from "./tracking.presenter";
import type { Party } from "./tracking.repository";

const nameOf = (party: Party | null, fallback: string) => party?.handle ?? party?.name ?? fallback;

/**
 * The tracker's action panel for whoever is looking: which side they're on,
 * which step the trade is at, and what's theirs to do. An offer carrying a bot
 * name came from Relicto's escrow bots (the designed flow), which keep their panel.
 */
export function toFulfilment(
  input: TrackingInput,
  viewerId: string,
  parties: { buyer: Party | null; seller: Party | null },
  testMode: boolean,
  now = new Date(),
): Fulfilment {
  const { order, offer } = input;
  const role = order.sellerId === viewerId ? "seller" : "buyer";
  const sent = offer?.status === "sent" || offer?.status === "accepted";

  const stage: Fulfilment["stage"] =
    order.state === "completed" ? "completed"
    : order.state === "cancelled" ? "cancelled"
    : order.state === "disputed" ? "disputed"
    : sent ? "offer-sent"
    : "awaiting-offer";

  const secondsLeft =
    stage === "awaiting-offer" && order.autoCancelSeconds
      ? Math.max(0, Math.round((order.placedAt.getTime() + order.autoCancelSeconds * 1000 - now.getTime()) / 1000))
      : null;

  return {
    role,
    stage,
    counterparty: role === "seller" ? nameOf(parties.buyer, "the buyer") : nameOf(parties.seller, order.counterpartyName ?? "the seller"),
    secondsLeft,
    buyerTradeUrl: role === "seller" ? (parties.buyer?.tradeUrl ?? null) : null,
    offerUrl: sent ? (offer?.offerUrl ?? null) : null,
    canSimulate: testMode && role === "buyer" && stage === "awaiting-offer",
    bot: Boolean(offer?.botName),
  };
}
