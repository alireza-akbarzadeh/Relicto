import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { IntelMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { TrackingMobile as TrackingMobileData } from "../../mobile.types";
import { EscrowSequence } from "./escrow-sequence";
import { OrderHashCard } from "./order-hash-card";
import { OrderItemCard } from "./order-item-card";
import { ShieldVerification } from "./shield-verification";
import { TrackingActions } from "./tracking-actions";

const TONE = { cyan: "bg-status-upcoming", amber: "text-tertiary", indigo: "text-secondary" };

/** Mobile order tracker (Stitch: "Lootora Mobile — Live Order Tracker & Escrow Protocol"). */
export function TrackingMobile({ order }: { order: TrackingMobileData }) {
  const active = order.steps.findIndex((step) => step.state === "active");
  const stage = `STEP ${active + 1} OF ${order.steps.length}`;

  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface">
      <IntelMobileHeader />
      <main className="relative flex w-full flex-col bg-surface pt-16 pb-20">
        <div className="flex w-full flex-col gap-space-md px-space-md py-space-sm text-on-surface">
          <OrderHashCard order={order} stage={stage} />
          <OrderItemCard item={order.item} seller={order.seller} />
          <EscrowSequence steps={order.steps} stage={stage} offerUrl={order.tradeOfferUrl} />
          <ShieldVerification shield={order.shield} />
          <TrackingActions offerUrl={order.tradeOfferUrl} code={order.code} />
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm font-data-mono-md text-label-badge text-text-muted">
            {order.telemetry.map((signal) => (
              <div key={signal.label} className="flex items-center gap-1.5">
                {signal.icon ? (
                  <Icon name={signal.icon} className={cn("text-[12px]", TONE[signal.tone])} />
                ) : (
                  <span className={cn("h-1.5 w-1.5 rounded-full", TONE[signal.tone])} />
                )}
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <MobileTabBar family="intel" active="tracker" />
    </div>
  );
}
