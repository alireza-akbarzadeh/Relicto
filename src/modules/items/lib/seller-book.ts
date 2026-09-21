import { parseAsBoolean, parseAsStringLiteral } from "nuqs/server";
import type { MobileSeller } from "../mobile.types";

export const SELLER_SORTS = ["price", "trust"] as const;
export type SellerSort = (typeof SELLER_SORTS)[number];

export const SELLER_SORT_LABEL: Record<SellerSort, string> = { price: "Lowest price", trust: "Highest trust" };

/** Mobile listing-book filters (mobile-only keys; desktop's `bot` default would hide P2P sellers). */
export const sellerBookSearchParams = {
  sellers: parseAsStringLiteral(SELLER_SORTS).withDefault("price"),
  instant: parseAsBoolean.withDefault(false),
};

/** Sort by price or trust, optionally keeping only automated escrow bots. */
export function arrangeSellers(sellers: MobileSeller[], sort: SellerSort, instantOnly: boolean) {
  const pool = instantOnly ? sellers.filter((seller) => seller.instant) : sellers;
  const by = sort === "trust" ? (a: MobileSeller, b: MobileSeller) => b.trustScore - a.trustScore : (a: MobileSeller, b: MobileSeller) => a.priceUsd - b.priceUsd;
  return [...pool].sort(by);
}
