import type { Metadata } from "next";
import { MarketplaceView } from "@/modules/marketplace/components/marketplace-view";
import { getMarketplaceCatalog } from "@/modules/marketplace/data/get-marketplace";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Discover, compare and trade verified Steam cosmetics with instant bot escrow.",
};

export default async function MarketplacePage({ searchParams }: PageProps<"/marketplace">) {
  const [{ q }, catalog] = await Promise.all([searchParams, getMarketplaceCatalog()]);
  const query = typeof q === "string" ? q : "";
  return <MarketplaceView catalog={catalog} query={query} />;
}
