import { parseAsStringLiteral } from "nuqs/server";
import type { CheckoutItem } from "../types";
import { RAILS, type MobileRail } from "../mobile.types";

/** Selected liquidity rail (`?rail=`). */
export const railSearchParam = parseAsStringLiteral(RAILS).withDefault("vault");

/** "Vendor: KuroSkins (99.8% Trust)" → { name: "KuroSkins", trust: "99.8%" }. */
export function vendorOf(item: CheckoutItem) {
  const line = item.intel.find((entry) => entry.startsWith("Vendor:"));
  const match = line?.match(/^Vendor:\s*(.+?)(?:\s*\((\d+(?:\.\d+)?%)[^)]*\))?(?:\s+Direct)?$/);
  return { name: match?.[1] ?? "Relicto Bot", trust: match?.[2] ?? null };
}

/** Subtotal, rail fee and payable total for the cart. */
export function cartTotals(items: CheckoutItem[], rail: MobileRail) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const fee = Math.round(subtotal * rail.feePct) / 100;
  return { subtotal, fee, total: subtotal + fee };
}
