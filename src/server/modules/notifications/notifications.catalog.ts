import type { notifications } from "@/lib/db/schema";
import { usd } from "../wallet/wallet.presenter";

/** A notification ready to store; the catalog below is the only place its copy is written. */
export type NotificationDraft = Required<
  Pick<typeof notifications.$inferInsert, "userId" | "kind" | "icon" | "tone" | "title" | "body" | "href" | "dedupeKey">
>;

type Order = { code: string; item: string };
type Bid = { offerId: string; item: string; bidCents: number };
const href = (code: string) => `/orders/${code}`;

/**
 * Trade lifecycle copy, one entry per event. Every draft carries a dedupe key
 * of order code + event + recipient, so a retried event can never notify twice.
 */
export const draft = {
  /** Seller: a buyer funded escrow on one of their listings. */
  orderReceived: (o: Order & { sellerId: string; totalCents: number }): NotificationDraft => ({
    userId: o.sellerId,
    kind: "order_received",
    icon: "shopping_bag",
    tone: "success",
    title: `Sold: ${o.item} — send the trade offer`,
    body: `${usd(o.totalCents)} is locked in escrow. Send the Steam trade offer within 12 hours, then mark it sent on the order.`,
    href: href(o.code),
    dedupeKey: `${o.code}:order_received:${o.sellerId}`,
  }),

  /** Buyer: their payment is in escrow and the seller has been asked to send the item. */
  orderPlaced: (o: Order & { buyerId: string; totalCents: number }): NotificationDraft => ({
    userId: o.buyerId,
    kind: "order_placed",
    icon: "shopping_bag",
    tone: "info",
    title: `Order placed: ${o.item}`,
    body: `${usd(o.totalCents)} is safe in escrow. The seller has 12 hours to send the Steam trade offer, or you're refunded.`,
    href: href(o.code),
    dedupeKey: `${o.code}:order_placed:${o.buyerId}`,
  }),

  /** Buyer: the seller sent the Steam trade offer; they have to accept it. */
  tradeOfferSent: (o: Order & { buyerId: string; token: string | null }): NotificationDraft => ({
    userId: o.buyerId,
    kind: "trade_offer_sent",
    icon: "swap_horiz",
    tone: "warning",
    title: `Trade offer ready for ${o.item}`,
    body: o.token
      ? `Accept it in Steam Mobile. Only confirm if the security token reads ${o.token}.`
      : "Accept it in Steam, then confirm receipt on the order to release the seller's payout.",
    href: href(o.code),
    dedupeKey: `${o.code}:trade_offer_sent:${o.buyerId}`,
  }),

  /** Seller: the trade completed and the payout landed. */
  itemSold: (o: Order & { sellerId: string; payoutCents: number }): NotificationDraft => ({
    userId: o.sellerId,
    kind: "item_sold",
    icon: "payments",
    tone: "success",
    title: `${o.item} sold`,
    body: `${usd(o.payoutCents)} was credited to your Relicto vault.`,
    href: href(o.code),
    dedupeKey: `${o.code}:item_sold:${o.sellerId}`,
  }),

  /** Buyer: the item is in their Steam inventory. */
  itemDelivered: (o: Order & { buyerId: string }): NotificationDraft => ({
    userId: o.buyerId,
    kind: "item_delivered",
    icon: "inventory_2",
    tone: "success",
    title: `${o.item} delivered`,
    body: "It's in your Steam inventory, and escrow has been released to the seller.",
    href: href(o.code),
    dedupeKey: `${o.code}:item_delivered:${o.buyerId}`,
  }),

  /** The other side: an escrow was frozen for review; funds stay locked. */
  orderDisputed: (o: Order & { userId: string }): NotificationDraft => ({
    userId: o.userId,
    kind: "system",
    icon: "gavel",
    tone: "warning",
    title: `Escrow frozen for ${o.item}`,
    body: "The other side reported a problem. Funds stay locked in escrow while Relicto reviews the trade.",
    href: href(o.code),
    dedupeKey: `${o.code}:order_disputed:${o.userId}`,
  }),

  /** Seller: a buyer bid on one of their listings. A revised bid notifies again. */
  offerReceived: (o: Bid & { sellerId: string; askCents: number }): NotificationDraft => ({
    userId: o.sellerId,
    kind: "offer_received",
    icon: "sell",
    tone: "info",
    title: `${usd(o.bidCents)} offer on ${o.item}`,
    body: `You're asking ${usd(o.askCents)}. Accept to open escrow at the offer price, or decline.`,
    href: "/sell#offers",
    dedupeKey: `offer:${o.offerId}:received:${o.bidCents}`,
  }),

  /** Buyer: the seller took the bid; escrow is funded from their vault. */
  offerAccepted: (o: Bid & { buyerId: string; code: string }): NotificationDraft => ({
    userId: o.buyerId,
    kind: "offer_accepted",
    icon: "check_circle",
    tone: "success",
    title: `Offer accepted for ${o.item}`,
    body: `${usd(o.bidCents)} moved from your vault into escrow. The seller has 12 hours to send the Steam trade offer.`,
    href: href(o.code),
    dedupeKey: `offer:${o.offerId}:accepted:${o.buyerId}`,
  }),

  /** Buyer: the bid is off the table — declined, outsold, or unfunded when accepted. */
  offerDeclined: (o: Bid & { buyerId: string; slug: string; reason: "declined" | "sold" | "short" }): NotificationDraft => ({
    userId: o.buyerId,
    kind: "offer_declined",
    icon: "cancel",
    tone: o.reason === "short" ? "alert" : "warning",
    title: o.reason === "sold" ? `${o.item} sold to another bidder` : `Offer on ${o.item} not taken`,
    body: {
      declined: `The seller declined your ${usd(o.bidCents)} offer. Nothing left your vault.`,
      sold: `The seller accepted a different offer. Nothing left your vault.`,
      short: `The seller accepted, but your vault couldn't cover ${usd(o.bidCents)}, so the offer lapsed.`,
    }[o.reason],
    href: `/items/${o.slug}`,
    dedupeKey: `offer:${o.offerId}:closed:${o.buyerId}`,
  }),

  /** Either side: the escrow was cancelled before the trade completed. */
  orderCancelled: (o: Order & { userId: string; role: "buyer" | "seller"; refundCents: number; reason: string }): NotificationDraft => ({
    userId: o.userId,
    kind: "order_cancelled",
    icon: "cancel",
    tone: "alert",
    title: o.role === "buyer" ? `Escrow cancelled for ${o.item}` : `${o.item} is back on the market`,
    body:
      o.role === "buyer"
        ? `${usd(o.refundCents)} was refunded to your vault. ${o.reason}`
        : `The buyer's escrow was cancelled, so your listing is live again. ${o.reason}`,
    href: href(o.code),
    dedupeKey: `${o.code}:order_cancelled:${o.userId}`,
  }),
};
