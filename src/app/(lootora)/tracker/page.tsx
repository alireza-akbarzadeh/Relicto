import type { Metadata } from "next";
import { TrackerView } from "@/modules/tracker/components/tracker-view";
import { getTracker } from "@/modules/tracker/data/get-tracker";

export const metadata: Metadata = { title: "Price Tracker", description: "Real-time cross-market price intelligence and arbitrage telemetry." };

export default async function TrackerPage() {
  return <TrackerView data={await getTracker()} />;
}
