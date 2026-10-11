import { Icon } from "@/components/ui/icon";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/cn";
import type { PaymentRail } from "../types";

export function PaymentOption({ rail, selected }: { rail: PaymentRail; selected: boolean }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-1.5 rounded-xl border p-3.5 transition-all",
        selected
          ? "border-primary/50 bg-surface-container-high/90 shadow-xs ring-1 ring-primary/20"
          : "border-white/6 bg-surface-container-lowest/80 hover:bg-surface-container-low hover:border-white/12",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <RadioGroupItem value={rail.id} aria-label={rail.title} className="shrink-0" />
          <Icon name={rail.icon} className="text-[17px] text-text-secondary shrink-0" />
          <span className="truncate font-headline-sm text-xs font-bold text-text-primary">{rail.title}</span>
          {rail.badge && (
            <span className="shrink-0 whitespace-nowrap rounded bg-primary-container/20 px-1.5 py-0.5 font-data-mono-md text-[10px] font-semibold text-primary">
              {rail.badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pl-7 font-data-mono-md text-[11px]">
        <span className="truncate text-text-muted">{rail.detail}</span>
        <span className={cn("shrink-0 font-medium", selected ? "text-status-upcoming" : "text-text-muted")}>
          {rail.note}
        </span>
      </div>
    </label>
  );
}
