"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { ACTIVITY_LABEL, activitySearchParam, TONE_TEXT } from "../../lib/mobile";
import { ACTIVITY_FILTERS, type LedgerEntry, type WalletMobile } from "../../mobile.types";

function Entry({ entry }: { entry: LedgerEntry }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-card p-space-sm shadow-xs">
      <div className="flex min-w-0 items-center gap-space-sm">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest">
          <Image src={entry.image} alt={entry.imageAlt} width={96} height={96} sizes="48px" className="h-full w-full object-cover" />
          {entry.game && (
            <span
              className={cn(
                "absolute right-0 bottom-0 rounded-tl-xs px-1 text-[8px] font-bold",
                entry.game.tone === "crimson" ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container",
              )}
            >
              {entry.game.label}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-headline-sm text-headline-sm leading-tight text-text-primary">{entry.title}</span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className={cn(
                "rounded px-1.5 font-label-badge text-label-badge",
                entry.status.strong ? "bg-surface-container-highest" : "bg-surface-container-high",
                TONE_TEXT[entry.status.tone],
              )}
            >
              {entry.status.label}
            </span>
            <span className={entry.refMono ? "font-data-mono-md text-[10px] text-text-muted" : "font-label-badge text-label-badge text-text-muted"}>{entry.ref}</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end pl-2">
        <span className={cn("font-data-mono-md text-data-mono-md", TONE_TEXT[entry.amountTone])}>{entry.amountUsd < 0 ? "-" : "+"}{formatMoney(Math.abs(entry.amountUsd))}</span>
        <span className={cn("font-label-badge text-label-badge", entry.whenTone === "muted" ? "text-text-muted" : "text-text-secondary")}>{entry.when}</span>
      </div>
    </div>
  );
}

/** Recent ledger with category chips (`?activity=`). */
export function LedgerActivity({ ledger }: { ledger: WalletMobile["ledger"] }) {
  const [filter, setFilter] = useQueryState("activity", activitySearchParam.withOptions({ history: "replace", clearOnDefault: true }));
  const entries = filter === "all" ? ledger.entries : ledger.entries.filter((entry) => entry.category === filter);

  return (
    <>
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-text-primary">Ledger Activity</span>
          <span className="font-label-badge text-label-badge text-text-muted">{ledger.total} Total Entries</span>
        </div>
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1">
          {ACTIVITY_FILTERS.map((option) => (
            <Button
              key={option}
              variant={null}
              size={null}
              aria-pressed={filter === option}
              onClick={() => void setFilter(option)}
              className={cn(
                "h-auto shrink-0 rounded-full border-0 px-3 py-1 font-label-caps text-label-caps font-bold uppercase",
                filter === option ? "bg-primary text-on-primary" : "bg-surface-container text-text-secondary hover:text-text-primary",
              )}
            >
              {ACTIVITY_LABEL[option]}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {entries.length ? (
          entries.map((entry) => <Entry key={entry.id} entry={entry} />)
        ) : (
          <p className="rounded-xl bg-surface-card p-space-md text-center font-body-sm text-body-sm text-text-muted">No {ACTIVITY_LABEL[filter].toLowerCase()} in this window.</p>
        )}
      </div>
    </>
  );
}
