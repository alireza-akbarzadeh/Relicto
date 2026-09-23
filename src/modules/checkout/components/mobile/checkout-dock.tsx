"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { useCheckoutDispatch } from "../../hooks/use-checkout-dispatch";
import { useMobileCheckout } from "../../hooks/use-mobile-checkout";
import { SETTLEMENT_RAIL } from "../../lib/mobile";
import type { CheckoutMobile } from "../../mobile.types";

/** Fixed settlement dock: partner ping, total (USD and ETH quote) and the authorize action. */
export function CheckoutDock({ data }: { data: CheckoutMobile }) {
  const router = useRouter();
  const { total, eth, rail, remainingUsd } = useMobileCheckout(data);
  const { dispatch, pending } = useCheckoutDispatch({
    onPlaced: (codes) => {
      toast.success("Multi-sig escrow authorized", { description: `${codes.length} items dispatched to Sentinel bots.` });
      router.push(`/orders/${codes[0]}`);
    },
  });

  const authorize = () => {
    if (rail.id === "vault" && remainingUsd < 0) {
      toast.error("Not enough vault balance", { description: `Top up ${formatMoney(-remainingUsd)} or pick another rail.` });
      return;
    }
    dispatch({ rail: SETTLEMENT_RAIL[rail.id] ?? rail.id, promo: false });
  };

  return (
    <aside className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/90 shadow-[0_-4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex flex-col gap-space-xs px-gutter py-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-ping rounded-full bg-tertiary" />
            <span className="font-label-badge text-label-badge tracking-wider text-text-secondary uppercase">Steam Trade Partner Ping:</span>
            <span className="font-label-badge text-label-badge font-bold text-tertiary">{data.dock.ping}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-label-badge text-label-badge text-text-muted">ESCROW HOLD:</span>
            <span className="font-label-badge text-label-badge font-bold text-text-primary">{data.dock.hold}</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-text-secondary uppercase">Total Escrow Valuation</span>
            <div className="flex items-baseline gap-1">
              <span className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary">{formatMoney(total)}</span>
              <span className="font-label-badge text-label-badge text-text-muted">USD</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded bg-surface-container/70 px-space-sm py-1">
            <Icon name="token" className="text-[16px] text-secondary" />
            <span className="font-data-mono-md text-data-mono-md font-bold text-secondary">{eth.toFixed(3)} ETH</span>
          </div>
        </div>
        <Button
          variant={null}
          size={null}
          onClick={authorize}
          disabled={pending}
          className="h-12 w-full gap-space-sm rounded border-0 bg-primary-container font-headline-sm text-headline-sm font-semibold tracking-wider text-on-primary uppercase shadow-[0_0_20px_rgba(255,81,106,0.35)] transition-all active:scale-[0.98]"
        >
          <Icon name="swap_horizontal_circle" className="text-[20px]" />
          <span>Authorize Multi-Sig Escrow</span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </Button>
      </div>
    </aside>
  );
}
