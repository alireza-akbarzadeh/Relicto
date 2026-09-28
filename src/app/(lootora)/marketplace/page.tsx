import type { Metadata } from "next";
import { MarketplaceView } from "@/modules/marketplace/components/marketplace-view";
import { MarketplaceMobile } from "@/modules/marketplace/components/mobile/marketplace-mobile";
import { getMarketplaceMobile, getMarketplaceResults } from "@/modules/marketplace/data/get-marketplace";
import { marketplaceMetadata } from "@/modules/marketplace/lib/marketplace-seo";
import { loadMarketplaceSearchParams, toFilters } from "@/modules/marketplace/lib/search-params";

export async function generateMetadata({ searchParams }: PageProps<"/marketplace">): Promise<Metadata> {
  return marketplaceMetadata(await searchParams);
}

/**
 * Filters live in the URL, and Postgres applies them: this reads the same nuqs
 * contract the sidebar writes, so the grid, the totals and the facet tallies
 * are one query rather than a catalog filtered in the browser.
 *
 * The design ships separate mobile and desktop compositions; CSS picks one at `md`.
 */
export default async function MarketplacePage({ searchParams }: PageProps<"/marketplace">) {
  const filters = toFilters(await loadMarketplaceSearchParams(searchParams));
  const [results, mobile] = await Promise.all([getMarketplaceResults(filters), getMarketplaceMobile()]);

  return (
    <>
      <div className="md:hidden">
        <MarketplaceMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <MarketplaceView results={results} />
      </div>
    </>
  );
}
