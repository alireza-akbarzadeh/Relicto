import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HistoryView } from "@/modules/orders/components/history-view";
import { getOrderLedger } from "@/modules/orders/data/get-orders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("ordersTitle"),
    description: t("ordersDesc"),
  };
}

export default async function OrdersPage() {
  const data = await getOrderLedger();
  return <HistoryView data={data} />;
}
