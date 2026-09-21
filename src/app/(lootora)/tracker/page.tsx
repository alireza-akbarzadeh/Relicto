import type { Metadata } from "next";
import { TrackerView } from "@/modules/tracker/components/tracker-view";
import { TrackerMobile } from "@/modules/tracker/components/mobile/tracker-mobile";
import { getTracker, getTrackerMobile } from "@/modules/tracker/data/get-tracker";

export const metadata: Metadata = { title: "Price Tracker", description: "Real-time cross-market price intelligence and arbitrage telemetry." };

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function TrackerPage() {
  const [data, mobile] = await Promise.all([getTracker(), getTrackerMobile()]);
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
