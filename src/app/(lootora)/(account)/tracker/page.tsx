import type { Metadata } from "next";
import { TrackerView } from "@/modules/tracker/components/tracker-view";
import { TrackerMobile } from "@/modules/tracker/components/mobile/tracker-mobile";
import { getTracker, getTrackerMarket, getTrackerMobile } from "@/modules/tracker/data/get-tracker";
import { loadTrackerSearchParams } from "@/modules/tracker/lib/search-params";

export const metadata: Metadata = { title: "Price Tracker", description: "Real-time cross-market price intelligence and arbitrage telemetry." };

/**
 * Separate mobile and desktop compositions; CSS picks one at `md`. `?asset=`
 * picks the focused item, `?market=` the market the live panels stream.
 */
export default async function TrackerPage({ searchParams }: PageProps<"/tracker">) {
  const { asset, market } = await loadTrackerSearchParams(searchParams);
  const [data, mobile] = await Promise.all([getTracker(asset), getTrackerMobile()]);
  // The focused item may fall back to the default, so the market frame follows what the terminal resolved.
  const marketFrame = await getTrackerMarket(market, data.live?.focus.slug ?? null);
  return (
    <>
      <div className="md:hidden">
        <TrackerMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <TrackerView data={data} market={marketFrame} />
      </div>
    </>
  );
}
