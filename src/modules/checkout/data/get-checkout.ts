import "server-only";
import { rethrowNextSignals } from "@/lib/next-signals";
import { requireSettledViewer } from "@/modules/orders/data/expire-escrows";
import { checkoutService } from "@/server/modules/checkout/checkout.service";
import type { CheckoutMobile } from "../mobile.types";
import type { CheckoutData, CheckoutItem } from "../types";
import { checkout } from "./checkout.mock";
import { checkoutMobile } from "./checkout-mobile.mock";

/**
 * The signed-in trader's basket, from Postgres. An emptied basket renders
 * empty; the sample basket only stands in on a database nobody has seeded.
 */
export async function getCheckout(): Promise<CheckoutData> {
  const viewerId = await requireSettledViewer();
  try {
    return (await checkoutService.basket(viewerId)) ?? checkout;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getCheckout] Fallback to mock:", err);
    return checkout;
  }
}

/** The basket lines the header cart starts from on every signed-in page. */
export async function getCartLines(): Promise<CheckoutItem[]> {
  const viewerId = await requireSettledViewer();
  try {
    return (await checkoutService.lines(viewerId)) ?? checkout.items;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getCartLines] Fallback to mock:", err);
    return checkout.items;
  }
}

/**
 * Mobile checkout: the same spendable vault balance the desktop rail quotes;
 * rails, handshake copy and the reservation window stay authored.
 */
export async function getCheckoutMobile(): Promise<CheckoutMobile> {
  const viewerId = await requireSettledViewer();
  try {
    return { ...checkoutMobile, vaultUsd: (await checkoutService.vaultCents(viewerId)) / 100 };
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getCheckoutMobile] Fallback to mock:", err);
    return checkoutMobile;
  }
}
