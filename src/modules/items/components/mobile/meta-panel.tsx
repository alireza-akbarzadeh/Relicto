import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ItemMobile } from "../../mobile.types";

/** Patch and tournament correlation: pickrate, winrate and the pro endorsement. */
export function MetaPanel({ meta }: { meta: ItemMobile["meta"] }) {
  return (
    <div className="px-space-md py-space-sm">
      <div className="relative flex flex-col gap-space-sm overflow-hidden rounded-xl bg-surface-card p-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <Icon name="analytics" className="text-[18px] text-tertiary" />
            <span className="font-label-caps text-label-caps tracking-wider text-tertiary uppercase">{meta.title}</span>
          </div>
          <span className="rounded bg-surface-container-highest px-space-xs py-0.5 font-label-badge text-label-badge text-text-primary">{meta.patch}</span>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-space-sm">
          {meta.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col rounded-lg bg-surface-container-lowest p-space-sm">
              <span className="font-label-badge text-label-badge text-text-muted">{stat.label}</span>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className={cn("font-data-mono-lg text-data-mono-lg font-bold", stat.valueTone === "primary" ? "text-primary" : "text-text-primary")}>
                  {stat.value}
                </span>
                <span className={cn("font-label-badge text-[10px]", stat.noteTone === "amber" ? "text-tertiary" : "text-text-muted")}>{stat.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container font-label-badge font-bold text-on-secondary">
            {meta.endorsement.initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{meta.endorsement.label}</span>
            <span className="truncate font-body-sm text-body-sm font-semibold text-text-primary">{meta.endorsement.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
