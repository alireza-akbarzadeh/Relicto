import type { CheckoutMobile as CheckoutMobileData } from "../../mobile.types";
import { CartLines } from "./cart-lines";
import { CheckoutDock } from "./checkout-dock";
import { CheckoutMobileHeader } from "./checkout-mobile-header";
import { SettlementCard } from "./settlement-card";

/** Mobile escrow checkout (Stitch: "Lootora Mobile — Multi-Item Escrow Checkout"). Lines are the live cart. */
export function CheckoutMobile({ data }: { data: CheckoutMobileData }) {
  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono flex min-h-screen flex-col bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <CheckoutMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface-container-lowest px-gutter pt-16 pb-36">
        <div className="flex w-full flex-col gap-space-md">
          <CartLines reserveSeconds={data.reserveSeconds} />
          <SettlementCard data={data} />
        </div>
      </main>
      <CheckoutDock data={data} />
    </div>
  );
}
