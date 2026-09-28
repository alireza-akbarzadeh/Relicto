import type { Metadata } from "next";
import { SellMobile } from "@/modules/sell/components/mobile/sell-mobile";
import { SellView } from "@/modules/sell/components/sell-view";
import { getIncomingOffers } from "@/modules/offers/data/get-incoming-offers";
import { getSell, getSellMobile } from "@/modules/sell/data/get-sell";

export const metadata: Metadata = {
  title: "Sell Items",
  description: "List Steam inventory items with live floor pricing and instant escrow liquidity.",
};

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function SellPage() {
  const [data, mobile, offers] = await Promise.all([getSell(), getSellMobile(), getIncomingOffers()]);
  return (
    <>
      <div className="md:hidden">
        <SellMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <SellView data={data} offers={offers} />
      </div>
    </>
  );
}
