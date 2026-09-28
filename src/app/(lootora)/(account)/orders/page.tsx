import type { Metadata } from "next";
import { HistoryView } from "@/modules/orders/components/history-view";
import { getOrderLedger } from "@/modules/orders/data/get-orders";

export const metadata: Metadata = {
  title: "Trade Ledger",
  description: "Every Steam bot trade, liquidation and escrow release with settlement details.",
};

export default async function OrdersPage() {
  const data = await getOrderLedger();
  return <HistoryView data={data} />;
}
