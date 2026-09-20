import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { OrderSummary, TrackedItem } from "../../types";

function Summary({ summary }: { summary: OrderSummary }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">Transaction Summary</span>
      {summary.lines.map((line) => (
        <div key={line.label} className="flex items-center justify-between font-body-sm text-body-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <span>{line.label}</span>
            {line.promo && (
              <span className="rounded bg-tertiary-fixed-dim/20 px-1 text-[9px] font-bold text-tertiary-fixed-dim">{line.promo}</span>
            )}
          </span>
          <span className={cn("font-data-mono-md font-semibold", line.tone === "free" ? "text-status-upcoming" : "text-text-primary")}>
            {formatMoney(line.value)}
          </span>
        </div>
      ))}
      <div className="my-space-xs h-px w-full bg-surface-variant" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm font-bold text-text-primary">Total Paid</span>
          <span className="font-label-badge text-label-badge text-text-muted uppercase">{summary.totalNote}</span>
        </div>
        <div className="font-data-mono-lg text-headline-lg font-bold text-tertiary-fixed-dim">{formatMoney(summary.totalUsd)}</div>
      </div>
    </div>
  );
}

/** The purchased item with its specs and settlement ledger. */
export function ItemCard({ item, summary }: { item: TrackedItem; summary: OrderSummary }) {
  return (
    <div className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="flex items-center justify-between">
        <span className="rounded bg-primary-container/20 px-space-sm py-0.5 font-label-badge text-label-badge font-bold tracking-wider text-primary uppercase">
          {item.game}
        </span>
        <span className="flex items-center gap-1 font-label-badge text-label-badge font-bold tracking-wider text-tertiary-fixed-dim uppercase">
          <Icon name="auto_awesome" className="text-[14px]" />
          {item.styleNote}
        </span>
      </div>
      <div className="group relative flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-deep shadow-inner">
        <div className="absolute inset-0 z-10 bg-linear-to-t/srgb from-surface-deep via-transparent to-transparent" />
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-space-sm bottom-space-sm left-space-sm z-20 flex items-center justify-between">
          <span className="rounded bg-surface-deep/90 px-space-xs py-0.5 font-data-mono-md text-[11px] font-bold text-status-upcoming uppercase backdrop-blur-md">
            {item.killsBadge}
          </span>
          <span className="rounded bg-surface-deep/90 px-space-xs py-0.5 font-data-mono-md text-[11px] text-text-primary uppercase backdrop-blur-md">
            {item.variantBadge}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="font-headline-md text-headline-md leading-tight font-bold text-text-primary">{item.name}</h2>
        <span className="mt-0.5 font-body-sm text-body-sm text-text-secondary">{item.slot}</span>
      </div>
      <div className="grid grid-cols-2 gap-space-xs rounded-lg bg-surface-container-low p-space-sm font-data-mono-md text-[12px]">
        {item.specs.map((spec) => (
          <div key={spec.label} className="flex flex-col">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">{spec.label}</span>
            <span className={cn("font-medium", spec.highlight ? "text-status-upcoming" : "text-text-primary")}>{spec.value}</span>
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-surface-variant" />
      <Summary summary={summary} />
    </div>
  );
}
