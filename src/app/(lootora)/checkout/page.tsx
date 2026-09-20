import type { Metadata } from "next";
import { CheckoutView } from "@/modules/checkout/components/checkout-view";
import { getCheckout } from "@/modules/checkout/data/get-checkout";

export const metadata: Metadata = {
  title: "Escrow Checkout",
  description: "Secure Steam item checkout with verified recipient routing and instant bot dispatch.",
};

export default async function CheckoutPage() {
  const data = await getCheckout();
  return <CheckoutView data={data} />;
}
