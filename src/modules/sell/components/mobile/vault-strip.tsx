"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useState } from "react";
import type { SellMobile } from "../../mobile.types";

const TABS = [
  { id: "forge", label: "Trade-Up Studio", icon: "local_fire_department", target: "trade-up-chamber" },
  { id: "liquidate", label: "Bulk Liquidate", icon: "currency_exchange", target: "bulk-cashout" },
] as const;

/** Steam vault summary and the studio switch, which jumps between the two sections. */
export function VaultStrip({ vault }: { vault: SellMobile["vault"] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("forge");

  const go = (next: (typeof TABS)[number]) => {
    setTab(next.id);
    document.getElementById(next.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="flex flex-col gap-space-xs px-margin pt-space-sm pb-space-sm">
        <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-low px-space-md py-space-sm shadow-xs">
          <div className="flex min-w-0 items-center gap-space-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-status-upcoming shadow-inner">
              <Icon name="sync" className="text-[18px]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary">Steam Vault</span>
                <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-badge text-label-badge text-status-upcoming uppercase">{vault.units} Units</span>
              </div>
              <span className="truncate font-body-sm text-body-sm text-text-secondary">Inventory value {formatMoney(vault.valueUsd)}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <span className="flex items-center gap-1 font-label-caps text-label-caps text-tertiary uppercase">
              <Icon name="bolt" className="text-[13px]" /> 0% Fee
            </span>
            <span className="font-label-badge text-label-badge text-on-surface-variant">Live Payout</span>
          </div>
        </div>
      </div>

      <div className="px-margin py-space-xs">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-container-lowest p-1">
          {TABS.map((option) => (
            <Button
              key={option.id}
              variant={null}
              size={null}
              aria-pressed={tab === option.id}
              onClick={() => go(option)}
              className={cn(
                "h-auto gap-2 rounded-lg border-0 py-2 font-headline-sm text-body-md font-normal transition-all",
                tab === option.id ? "bg-primary-container text-on-primary shadow-md" : "bg-surface-container-low text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon name={option.icon} className="text-[18px]" />
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
