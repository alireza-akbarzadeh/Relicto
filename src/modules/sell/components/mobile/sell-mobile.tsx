import type { IncomingOffer } from "@/modules/offers/types";
import { LinkedMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { SellMobile as SellMobileData } from "../../mobile.types";
import { BulkCashout } from "./bulk-cashout";
import { MobileOffersInbox } from "./mobile-offers-inbox";
import { TradeUpChamber } from "./trade-up-chamber";
import { VaultStrip } from "./vault-strip";

/** Mobile liquidation, trade-up and offers studio (Stitch: "Lootora Mobile — Inventory Liquidation & Trade-Up"). */
export function SellMobile({ data, offers = [] }: { data: SellMobileData; offers?: IncomingOffer[] }) {
  return (
    <div className="flex flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <LinkedMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface pt-16 pb-24">
        <div className="flex w-full flex-col pb-6">
          <VaultStrip vault={data.vault} />
          <TradeUpChamber contract={data.contract} />
          <BulkCashout cashout={data.cashout} />
          <MobileOffersInbox offers={offers} />
        </div>
      </main>
      <MobileTabBar family="linked" active="inventory" />
    </div>
  );
}
