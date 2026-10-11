import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { CheckoutItem } from "../types";

export function DispatchModal({
  items = [],
  onClose,
  onMonitor,
}: {
  items?: CheckoutItem[];
  onClose: () => void;
  onMonitor: () => void;
}) {
  const totalSentinels = items.length || 3;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-canvas-base/80 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-lg flex-col gap-space-md rounded-xl bg-surface-card p-space-lg shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-ping rounded-full bg-status-live" />
            <span className="font-headline-sm text-headline-sm text-text-primary uppercase">Dispatching Escrow Fleet</span>
          </div>
          <Button
            variant={null}
            size="icon-sm"
            onClick={onClose}
            aria-label="Close dispatch dialog"
            className="text-text-muted hover:text-text-primary"
          >
            <Icon name="close" className="text-[18px]" />
          </Button>
        </div>
        <div className="flex flex-col gap-3 rounded-lg bg-surface-container-lowest p-4">
          <div className="flex items-center justify-between font-data-mono-md text-body-sm">
            <span className="text-text-secondary">Bot Dispatch Pipeline:</span>
            <span className="font-bold text-status-upcoming">{totalSentinels} of {totalSentinels} Sentinels Assigned</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-surface-container-high">
            <div className="h-full w-2/3 rounded bg-primary-container" />
          </div>
          <div className="flex flex-col gap-1.5 font-data-mono-md text-label-badge text-text-muted">
            {items.length > 0 ? (
              items.map((item, idx) => {
                const botName = item.bot || `Sentinel #${String(42 - idx * 5).padStart(2, "0")}`;
                const status = idx === 0 ? "Offer Created" : idx === 1 ? "Generating Token..." : "Queued";
                const tone = idx === 0 ? "text-status-upcoming" : idx === 1 ? "text-tertiary" : "";
                return (
                  <span key={item.id || idx} className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      {botName} ({item.name})
                    </span>
                    <span className={cn("shrink-0", tone)}>{status}</span>
                  </span>
                );
              })
            ) : (
              <>
                <span className="flex justify-between">
                  <span>Sentinel #42 (Phantom Assassin)</span>
                  <span className="text-status-upcoming">Offer Created</span>
                </span>
                <span className="flex justify-between">
                  <span>Sentinel #09 (Butterfly Doppler)</span>
                  <span className="text-tertiary">Generating Token...</span>
                </span>
                <span className="flex justify-between">
                  <span>Sentinel #14 (AK-47 Case Hardened)</span>
                  <span>Queued</span>
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
          <Icon name="phonelink_ring" className="text-[24px] text-tertiary" />
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm font-bold text-text-primary">Action Required: Steam Mobile 2FA</span>
            <span className="font-body-sm text-body-sm text-text-secondary">
              Open Steam Mobile App &gt; Confirmations &gt; Accept verified bot offers.
            </span>
          </div>
        </div>
        <Button
          onClick={onMonitor}
          className="h-auto self-end rounded bg-primary-container px-4 py-2 font-headline-sm text-body-sm font-bold text-on-primary-container uppercase"
        >
          I Understand, Monitor Trades
        </Button>
      </div>
    </div>
  );
}
