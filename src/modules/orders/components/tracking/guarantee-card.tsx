import { Icon } from "@/components/ui/icon";
import type { OrderTracking } from "../../types";

/** Escrow protection promise under the trade panel. */
export function GuaranteeCard({ guarantee }: { guarantee: OrderTracking["guarantee"] }) {
  return (
    <div className="relative flex flex-col items-start gap-space-lg overflow-hidden rounded-xl bg-surface-container p-space-lg shadow-md sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-status-upcoming/10 text-status-upcoming shadow-sm">
        <Icon name="shield_with_heart" className="text-[32px]" />
      </div>
      <div className="flex flex-1 flex-col gap-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary uppercase">{guarantee.title}</span>
          <span className="rounded bg-status-upcoming/20 px-space-xs py-0.5 font-label-badge text-label-badge font-bold text-status-upcoming uppercase">
            {guarantee.badge}
          </span>
        </div>
        <p className="font-body-md text-body-md leading-relaxed text-text-secondary">
          Your funds of <span className="font-bold text-text-primary">{guarantee.amount}</span> {guarantee.body}
        </p>
      </div>
    </div>
  );
}
