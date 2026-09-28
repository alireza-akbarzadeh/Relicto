import type { Metadata } from "next";
import { AlertsView } from "@/modules/alerts/components/alerts-view";
import { AlertsMobile } from "@/modules/alerts/components/mobile/alerts-mobile";
import { getAlerts, getAlertsMobile } from "@/modules/alerts/data/get-alerts";

export const metadata: Metadata = { title: "Price Alerts", description: "Monitor item prices and receive market movement alerts." };

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function AlertsPage() {
  const [alerts, mobile] = await Promise.all([getAlerts(), getAlertsMobile()]);
  return (
    <>
      <div className="md:hidden">
        <AlertsMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <AlertsView alerts={alerts} />
      </div>
    </>
  );
}
