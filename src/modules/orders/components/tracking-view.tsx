import { LedgerFooter } from "@/modules/relicto/components/shell/footers";
import { LedgerHeader } from "@/modules/relicto/components/shell/ledger-header";
import type { OrderTracking } from "../types";
import { EscrowSteps } from "./tracking/escrow-steps";
import { FulfilmentPanel } from "./tracking/fulfilment-panel";
import { GuaranteeCard } from "./tracking/guarantee-card";
import { ItemCard } from "./tracking/item-card";
import { StatusBanner } from "./tracking/status-banner";
import { TelemetryStream } from "./tracking/telemetry-stream";
import { TradePanel } from "./tracking/trade-panel";
import { VendorCard } from "./tracking/vendor-card";

/** Stitch: "Relicto — Live Order Tracking & Escrow Protocol". */
export function TrackingView({ order }: { order: OrderTracking }) {
  return (
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
      <LedgerHeader />
      <main className="w-full pt-16">
        <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-space-lg px-gutter-desktop py-space-lg">
          <StatusBanner order={order} />
          <EscrowSteps steps={order.steps} />
          <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
            <div className="flex flex-col gap-space-lg lg:col-span-8">
              {/* Peer-to-peer trades get their action panel; the Sentinel bot panel only applies when a bot runs the trade. */}
              {order.fulfilment && <FulfilmentPanel code={order.code} fulfilment={order.fulfilment} />}
              {(!order.fulfilment || order.fulfilment.bot) && <TradePanel code={order.code} bot={order.bot} token={order.token} />}
              <GuaranteeCard guarantee={order.guarantee} />
            </div>
            <div className="flex flex-col gap-space-lg lg:col-span-4">
              <ItemCard item={order.item} summary={order.summary} />
              <VendorCard vendor={order.vendor} />
            </div>
          </div>
          <TelemetryStream telemetry={order.telemetry} />
        </div>
      </main>
      <LedgerFooter />
    </div>
  );
}
