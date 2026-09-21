import { MarketMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { MarketMobileData } from "../../mobile.types";
import { MobileMarketProvider } from "../../state/mobile-market-provider";
import { CategoryPills } from "./category-pills";
import { EngineTicker } from "./engine-ticker";
import { MarketFilterChips } from "./market-filter-chips";
import { MarketSearchBar } from "./market-search-bar";
import { MetaSpikeBanner } from "./meta-spike-banner";
import { MobileListingGrid } from "./mobile-listing-grid";

/** Mobile marketplace (Stitch: "Lootora Mobile — Marketplace Trading Hub"). */
export function MarketplaceMobile({ data }: { data: MarketMobileData }) {
  return (
    <MobileMarketProvider listings={data.listings}>
      <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-canvas-base font-body-md text-on-surface antialiased selection:bg-primary selection:text-on-primary">
        <MarketMobileHeader />
        <main className="flex min-h-[max(884px,100dvh)] w-full flex-1 flex-col bg-canvas-base pt-16 pb-24">
          <div className="flex w-full flex-col gap-space-md px-space-md py-space-sm">
            <MarketSearchBar placeholder={data.searchPlaceholder} />
            <CategoryPills pills={data.categories} />
            <MarketFilterChips />
            <MetaSpikeBanner spike={data.spike} />
            <MobileListingGrid />
            <EngineTicker ticker={data.ticker} />
          </div>
        </main>
        <MobileTabBar family="market" active="market" />
      </div>
    </MobileMarketProvider>
  );
}
