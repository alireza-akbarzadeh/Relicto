import { MarketFooter } from "@/modules/relicto/components/shell/footers";
import { LISTINGS_ANCHOR } from "../lib/scroll";
import { MarketplaceProvider } from "../state/marketplace-provider";
import type { MarketplaceResults } from "../types";
import { FilterSidebar } from "./filters/filter-sidebar";
import { MarketHero } from "./hero/market-hero";
import { TrendingMovers } from "./movers/trending-movers";
import { LiquidateBanner } from "./promo/liquidate-banner";
import { RecentlyViewed } from "./promo/recently-viewed";
import { ListingGrid } from "./results/listing-grid";
import { PaginationBar } from "./results/pagination-bar";
import { ResultsToolbar } from "./results/results-toolbar";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";

type MarketplaceViewProps = { results: MarketplaceResults };

/** Stitch: "Relicto — Marketplace Item Discovery & Trading Hub". */
export function MarketplaceView({ results }: MarketplaceViewProps) {
  return (
    <MarketplaceProvider results={results}>
      <div className="bg-canvas-base font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
        <StudioHeader />
        <main className="min-h-screen w-full bg-canvas-base pt-20">
          <div className="flex w-full flex-col">
            {/* overflow-x-clip (not overflow-hidden) so the sticky filter rail keeps working. */}
            <div className="relative w-full overflow-x-clip">
              <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
              <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-[500px] rounded-full bg-[rgb(245_158_11/0.1)] blur-3xl" />
              <div className="pointer-events-none absolute top-48 left-10 h-72 w-72 rounded-full bg-[rgb(99_102_241/0.1)] blur-3xl" />
              <MarketHero />
              <TrendingMovers />
              <div className="w-full px-margin-desktop py-space-lg">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-space-lg lg:flex-row">
                  <FilterSidebar />
                  <section id={LISTINGS_ANCHOR} className="flex w-full min-w-0 flex-1 scroll-mt-20 flex-col">
                    <ResultsToolbar />
                    <ListingGrid />
                    <PaginationBar />
                    <LiquidateBanner />
                    <RecentlyViewed />
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
        <MarketFooter />
      </div>
    </MarketplaceProvider>
  );
}
