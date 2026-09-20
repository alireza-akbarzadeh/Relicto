import type { Metadata } from "next";
import { MarketplaceView } from "@/modules/marketplace/components/marketplace-view";
import { getMarketplaceCatalog } from "@/modules/marketplace/data/get-marketplace";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Discover, compare and trade verified Steam cosmetics with instant bot escrow.",
};

/** Filters live in the URL (nuqs), so this stays a plain server component. */
export default async function MarketplacePage() {
  const catalog = await getMarketplaceCatalog();
  return <MarketplaceView catalog={catalog} />;
}
