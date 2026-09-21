import "server-only";
import type { CheckoutMobile } from "../mobile.types";
import { checkout } from "./checkout.mock";
import { checkoutMobile } from "./checkout-mobile.mock";

/** Reserved cart snapshot; replace with cart and escrow APIs later. */
export async function getCheckout() {
  return checkout;
}

/** Mobile checkout settings: vault balance, rails, handshake and reservation window. */
export async function getCheckoutMobile(): Promise<CheckoutMobile> {
  return checkoutMobile;
}
