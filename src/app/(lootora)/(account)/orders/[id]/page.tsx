import type { Metadata } from "next";
import { TrackingMobile } from "@/modules/orders/components/mobile/tracking-mobile";
import { TrackingView } from "@/modules/orders/components/tracking-view";
import { getOrderTracking, getOrderTrackingMobile } from "@/modules/orders/data/get-order";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Live escrow pipeline, Steam trade offer confirmation and settlement ledger for an order.",
};

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function OrderTrackingPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const [order, mobile] = await Promise.all([getOrderTracking(id), getOrderTrackingMobile(id)]);
  return (
    <>
      <div className="md:hidden">
        <TrackingMobile order={mobile} />
      </div>
      <div className="hidden md:block">
        <TrackingView order={order} />
      </div>
    </>
  );
}
