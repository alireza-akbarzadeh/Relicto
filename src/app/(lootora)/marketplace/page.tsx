import type { Metadata } from "next";
import { MarketplaceView } from "@/modules/marketplace/components/marketplace-view";
import { MarketplaceMobile } from "@/modules/marketplace/components/mobile/marketplace-mobile";
import { getMarketplaceCatalog, getMarketplaceMobile } from "@/modules/marketplace/data/get-marketplace";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Discover, compare and trade verified Steam cosmetics with instant bot escrow.",
};

/**
 * Filters live in the URL (nuqs), so this stays a plain server component.
 * The design ships separate mobile and desktop compositions; CSS picks one at `md`.
 */
export default async function MarketplacePage() {
  const [catalog, mobile] = await Promise.all([getMarketplaceCatalog(), getMarketplaceMobile()]);
  return (
    <>
      <div className="md:hidden">
        <MarketplaceMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <MarketplaceView catalog={catalog} />
      </div>
    </>
  );
}
