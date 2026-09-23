import { parseAsStringLiteral } from "nuqs/server";
import type { CheckoutItem } from "../types";
import { quote } from "./pricing";
import { RAILS, type MobileRail } from "../mobile.types";

/** Selected liquidity rail (`?rail=`). */
export const railSearchParam = parseAsStringLiteral(RAILS).withDefault("vault");

/** "Vendor: KuroSkins (99.8% Trust)" → { name: "KuroSkins", trust: "99.8%" }. */
export function vendorOf(item: CheckoutItem) {
  const line = item.intel.find((entry) => entry.startsWith("Vendor:"));
  const match = line?.match(/^Vendor:\s*(.+?)(?:\s*\((\d+(?:\.\d+)?%)[^)]*\))?(?:\s+Direct)?$/);
  return { name: match?.[1] ?? "Relicto Bot", trust: match?.[2] ?? null };
}

/**
 * Subtotal, rail fee and payable total for the cart, priced by the same rules
 * the server charges by. Mobile has no promo field, so no promo is applied.
 */
export function cartTotals(items: CheckoutItem[], rail: MobileRail) {
  const due = quote(items.map((item) => Math.round(item.price * 100)), false);
  const payable = due.dueCents / 100;
  const fee = Math.round(payable * rail.feePct) / 100;
  return { subtotal: due.subtotalCents / 100, fee, total: payable + fee };
}

/** Mobile rail ids → the settlement rails the server knows. */
export const SETTLEMENT_RAIL: Record<string, string> = { vault: "relicto", crypto: "crypto", card: "card" };
