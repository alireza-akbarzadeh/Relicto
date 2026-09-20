import "server-only";
import { checkout } from "./checkout.mock";

/** Reserved cart snapshot; replace with cart and escrow APIs later. */
export async function getCheckout() {
  return checkout;
}
