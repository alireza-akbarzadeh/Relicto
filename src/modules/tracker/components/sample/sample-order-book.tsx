import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import type { TrackerData } from "../../types";

/** The designed cross-venue book, shown only without a live one. */
export function SampleOrderBook({ rows }: { rows: TrackerData["orderBook"] }) {
  const lowestAsk = rows.find((r) => r.side === "sell")?.price ?? "$3,150.00";

  return (
    <section className="flex flex-col gap-space-md rounded-xl border border-white/8 bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-headline-sm text-headline-sm text-text-primary">
          <Icon name="view_list" className="text-[18px] text-primary" />
          Order Book
        </h2>
        <span className="font-label-badge text-[10px] text-status-upcoming uppercase">Tight Spread</span>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div
            key={`${row.side}-${row.price}`}
            className={cn(
              "grid grid-cols-[1fr_1fr_1fr] rounded px-2 py-1.5 font-data-mono-md text-[11px]",
              row.side === "sell" ? "bg-primary/10 text-primary" : "bg-status-upcoming/10 text-status-upcoming",
            )}
          >
            <span>{row.price}</span>
            <span className="text-text-muted">{row.source}</span>
            <span className="text-right text-text-primary">{row.total}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between rounded bg-surface-container-lowest px-2 py-2 font-label-badge text-[10px] text-text-muted uppercase">
        <span>
          Spread <b className="text-tertiary">$10.00 (0.32%)</b>
        </span>
        <span>
          Depth <b className="text-status-upcoming">$34,891</b>
        </span>
      </div>
      <LinkButton
        href="/marketplace?sort=price_asc"
        className="h-auto justify-center gap-1.5 rounded bg-primary-container py-2 font-label-caps text-label-caps font-bold text-on-primary-container uppercase transition-colors hover:bg-primary"
      >
        <Icon name="bolt" className="text-[16px]" />
        <span>Scan Lowest Ask ({lowestAsk})</span>
      </LinkButton>
    </section>
  );
}
