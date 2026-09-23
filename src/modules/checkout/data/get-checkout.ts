import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { checkoutService } from "@/server/modules/checkout/checkout.service";
import type { CheckoutMobile } from "../mobile.types";
import type { CheckoutData } from "../types";
import { checkout } from "./checkout.mock";
import { checkoutMobile } from "./checkout-mobile.mock";

/**
 * The signed-in trader's basket, from Postgres. Falls back to the sample basket
 * while the cart is empty, so the screen never renders blank.
 */
export async function getCheckout(): Promise<CheckoutData> {
  return (await checkoutService.basket(await requireUserId())) ?? checkout;
}

/** Mobile checkout settings: vault balance, rails, handshake and reservation window. */
export async function getCheckoutMobile(): Promise<CheckoutMobile> {
  return checkoutMobile;
}
