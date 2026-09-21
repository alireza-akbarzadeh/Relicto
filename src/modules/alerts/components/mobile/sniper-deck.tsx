"use client";

import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import type { AlertsMobile } from "../../mobile.types";
import { useAlertRules } from "../../state/alert-rules-provider";

const CELL = "flex flex-col justify-between rounded-lg bg-surface-card p-space-sm shadow-xs";

/** Terminal status: active rules, armed sniper bots (live from the rule book) and the monitored vault. */
export function SniperDeck({ data }: { data: AlertsMobile }) {
  const { rules, armedCount } = useAlertRules();
  const armedPct = rules.length ? Math.round((armedCount / rules.length) * 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-md">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-container/10 blur-2xl" />
      <div className="flex items-center justify-between pb-space-sm">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-status-live" />
          <span className="font-label-caps text-label-caps tracking-wider text-on-surface uppercase">Sniper Terminal Active</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-surface-container-highest px-2 py-0.5">
          <Icon name="bolt" className="text-[13px] text-tertiary" />
          <span className="font-label-badge text-label-badge text-tertiary">{data.latency}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-space-sm pt-1">
        <div className={CELL}>
          <span className="font-label-badge text-label-badge text-text-secondary uppercase">Active Rules</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-text-primary">{data.activeRules}</span>
            <span className="font-label-badge text-label-badge font-medium text-emerald-400">LIVE</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full bg-primary-container" style={{ width: `${data.rulesCapacityPct}%` }} />
          </div>
        </div>
        <div className={CELL}>
          <span className="font-label-badge text-label-badge text-text-secondary uppercase">Sniper Bots</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{armedCount}</span>
            <span className="font-label-badge text-label-badge text-primary uppercase">ARMED</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full animate-pulse bg-primary transition-all" style={{ width: `${armedPct}%` }} />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-lg bg-surface-card p-space-sm shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container">
              <Icon name="lock" className="text-[18px] text-tertiary" />
            </div>
            <div>
              <div className="font-label-badge text-label-badge text-text-secondary uppercase">Vault Monitored</div>
              <div className="font-data-mono-lg text-data-mono-lg text-text-primary">{formatMoney(data.vaultUsd)}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-badge text-label-badge text-text-secondary">STEAM API POLL</span>
            <span className="font-data-mono-md text-data-mono-md text-status-upcoming">{data.poll}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
