import type { Metadata } from "next";
import { AlertsView } from "@/modules/alerts/components/alerts-view";
import { getAlerts } from "@/modules/alerts/data/get-alerts";

export const metadata: Metadata = { title: "Price Alerts", description: "Monitor item prices and receive market movement alerts." };

export default async function AlertsPage() {
  return <AlertsView alerts={await getAlerts()} />;
}
