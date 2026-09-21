import { LinkedMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { AlertsMobile as AlertsMobileData } from "../../mobile.types";
import { AlertsBody } from "./alerts-body";

/** Mobile sniper terminal (Stitch: "Lootora Mobile — Price Alerts & Sniper Bots"). */
export function AlertsMobile({ data }: { data: AlertsMobileData }) {
  return (
    <div className="flex flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <LinkedMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface pt-16 pb-24">
        <AlertsBody data={data} />
      </main>
      <MobileTabBar family="linked" active="alerts" />
    </div>
  );
}
