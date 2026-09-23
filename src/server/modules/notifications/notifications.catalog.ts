import type { notifications } from "@/lib/db/schema";
import { usd } from "../wallet/wallet.presenter";

/** A notification ready to store; the catalog below is the only place its copy is written. */
export type NotificationDraft = Required<
  Pick<typeof notifications.$inferInsert, "userId" | "kind" | "icon" | "tone" | "title" | "body" | "href" | "dedupeKey">
>;

type Order = { code: string; item: string };
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
    title: `Someone is buying ${o.item}`,
    body: `${usd(o.totalCents)} is locked in escrow. A Sentinel bot will request the item from your Steam inventory.`,
    href: href(o.code),
    dedupeKey: `${o.code}:order_received:${o.sellerId}`,
  }),

  /** Buyer: the bot sent the Steam trade offer; they have to accept it. */
  tradeOfferSent: (o: Order & { buyerId: string; token: string | null }): NotificationDraft => ({
    userId: o.buyerId,
    kind: "trade_offer_sent",
    icon: "swap_horiz",
    tone: "warning",
    title: `Trade offer ready for ${o.item}`,
    body: o.token
      ? `Accept it in Steam Mobile. Only confirm if the security token reads ${o.token}.`
      : "Accept it in the Steam Mobile app to receive your item.",
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
