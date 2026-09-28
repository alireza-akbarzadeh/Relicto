import type { Metadata } from "next";
import { TrackerView } from "@/modules/tracker/components/tracker-view";
import { TrackerMobile } from "@/modules/tracker/components/mobile/tracker-mobile";
import { getTracker, getTrackerMobile } from "@/modules/tracker/data/get-tracker";
import { loadTrackerSearchParams } from "@/modules/tracker/lib/search-params";

export const metadata: Metadata = { title: "Price Tracker", description: "Real-time cross-market price intelligence and arbitrage telemetry." };

/** Separate mobile and desktop compositions; CSS picks one at `md`. `?asset=` picks the focused item. */
export default async function TrackerPage({ searchParams }: PageProps<"/tracker">) {
  const { asset } = await loadTrackerSearchParams(searchParams);
  const [data, mobile] = await Promise.all([getTracker(asset), getTrackerMobile()]);
  return (
    <>
      <div className="md:hidden">
        <TrackerMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <TrackerView data={data} />
      </div>
    </>
  );
}
