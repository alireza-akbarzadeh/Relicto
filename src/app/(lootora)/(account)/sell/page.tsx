import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SellMobile } from "@/modules/sell/components/mobile/sell-mobile";
import { SellView } from "@/modules/sell/components/sell-view";
import { getIncomingOffers } from "@/modules/offers/data/get-incoming-offers";
import { getSell, getSellMobile } from "@/modules/sell/data/get-sell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("sellTitle"),
    description: t("sellDesc"),
  };
}

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function SellPage() {
  const [data, mobile, offers] = await Promise.all([getSell(), getSellMobile(), getIncomingOffers()]);
  return (
    <>
      <div className="md:hidden">
        <SellMobile data={mobile} offers={offers} />
      </div>
      <div className="hidden md:block">
        <SellView data={data} offers={offers} contract={mobile.contract} />
      </div>
    </>
  );
}
