import type { Metadata } from "next";
import { CheckoutView } from "@/modules/checkout/components/checkout-view";
import { CheckoutMobile } from "@/modules/checkout/components/mobile/checkout-mobile";
import { getCheckout, getCheckoutMobile } from "@/modules/checkout/data/get-checkout";

export const metadata: Metadata = {
  title: "Escrow Checkout",
  description: "Secure Steam item checkout with verified recipient routing and instant bot dispatch.",
};

/** Separate mobile and desktop compositions; CSS picks one at `md`. Both read the live cart. */
export default async function CheckoutPage() {
  const [data, mobile] = await Promise.all([getCheckout(), getCheckoutMobile()]);
  return (
    <>
      <div className="md:hidden">
        <CheckoutMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <CheckoutView data={data} />
      </div>
    </>
  );
}
