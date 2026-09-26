import { bidDiscount } from "@/modules/offers/lib/bid-rules";
import type { IncomingOffer, MyBid } from "@/modules/offers/types";
import { ago } from "../shared/ago";
import { initials } from "../shared/initials";
import type { IncomingRow } from "./offers.repository";

const HOUR = 60 * 60 * 1000;

/** "2d 23h left", "5h left", "under 1h left" — time until a bid lapses. */
export function timeLeft(expiresAt: Date | null, now = new Date()) {
  if (!expiresAt) return "Open";
  const left = expiresAt.getTime() - now.getTime();
  if (left < HOUR) return "under 1h left";
  const days = Math.floor(left / (24 * HOUR));
  const hours = Math.floor((left % (24 * HOUR)) / HOUR);
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
}

export const toMyBid = (row: { id: string; priceCents: number; expiresAt: Date | null }, now = new Date()): MyBid => ({
  id: row.id,
  priceUsd: row.priceCents / 100,
  expires: timeLeft(row.expiresAt, now),
});

/** The studio inbox: one row per bid, with the top bid on each copy flagged. */
export function toIncomingOffers(rows: IncomingRow[], now = new Date()): IncomingOffer[] {
  const top = new Map<string, number>();
  for (const row of rows) top.set(row.listingId, Math.max(top.get(row.listingId) ?? 0, row.offer.priceCents));

  return rows.map((row) => {
    const name = row.handle ?? row.buyerName;
    return {
      id: row.offer.id,
      listingId: row.listingId,
      item: {
        name: row.itemName,
        slug: row.itemSlug,
        image: row.listingImage ?? row.itemImage ?? "",
        imageAlt: row.listingImageAlt ?? row.itemImageAlt ?? row.itemName,
      },
      bidder: {
        name,
        initials: initials(name),
        trust: row.trustScore !== null ? `${row.trustScore / 10}% trust · ${(row.tradeCount ?? 0).toLocaleString("en-US")} trades` : "New trader",
      },
      bidUsd: row.offer.priceCents / 100,
      askUsd: row.askCents / 100,
      discount: bidDiscount(row.offer.priceCents, row.askCents),
      note: row.offer.note,
      placed: ago(row.offer.updatedAt, now),
      expires: timeLeft(row.offer.expiresAt, now),
      top: row.offer.priceCents === top.get(row.listingId),
    };
  });
}
