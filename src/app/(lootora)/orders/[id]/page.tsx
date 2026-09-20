import type { Metadata } from "next";
import { TrackingView } from "@/modules/orders/components/tracking-view";
import { getOrderTracking } from "@/modules/orders/data/get-order";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Live escrow pipeline, Steam trade offer confirmation and settlement ledger for an order.",
};

export default async function OrderTrackingPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const order = await getOrderTracking(id);
  return <TrackingView order={order} />;
}
