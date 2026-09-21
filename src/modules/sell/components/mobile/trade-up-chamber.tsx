"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { useTradeUp } from "../../hooks/use-trade-up";
import type { SellMobile } from "../../mobile.types";
import { ForgeResultDialog } from "./forge-result-dialog";
import { OutcomeOdds } from "./outcome-odds";
import { SlotDeck } from "./slot-deck";

/** Contract chamber: slot count, value / EV / float strip, ROI, the slot deck, odds and Ignite. */
export function TradeUpChamber({ contract }: { contract: SellMobile["contract"] }) {
  const tradeUp = useTradeUp(contract);
  const { pct, delta } = tradeUp.roi;
  const calculating = tradeUp.phase === "calculating";

  return (
    <div id="trade-up-chamber" className="mt-space-sm flex scroll-mt-20 flex-col gap-space-md px-margin">
      <div className="relative flex flex-col gap-space-sm overflow-hidden rounded-xl bg-surface-card p-space-md shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary-container shadow-xs" />
            <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase">Contract Chamber</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-surface-container-lowest px-2 py-1">
            <span className="font-label-badge text-label-badge text-tertiary">SLOTS:</span>
            <span className="font-data-mono-md text-data-mono-md text-text-primary">
              {tradeUp.filled} / {contract.slots}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-surface-container-lowest p-space-sm">
          <div className="flex flex-col">
            <span className="font-label-badge text-label-badge text-text-secondary">INPUT VALUE</span>
            <span className="font-data-mono-md text-data-mono-md text-text-primary">{formatMoney(tradeUp.input)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-badge text-label-badge text-text-secondary">EST. EV</span>
            <span className="font-data-mono-md text-data-mono-md text-tertiary">{formatMoney(contract.evUsd)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-badge text-label-badge text-status-upcoming">FLOAT AVG</span>
            <span className="font-data-mono-md text-data-mono-md text-status-upcoming">{contract.floatAvg}</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-surface-container px-space-sm py-1.5">
          <div className="flex items-center gap-1.5">
            <Icon name="trending_up" className="text-[18px] text-tertiary" />
            <span className="font-label-caps text-label-caps text-on-surface">EXPECTED RETURN</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-data-mono-md text-data-mono-md text-tertiary">
              {pct >= 0 ? "+" : ""}
              {pct.toFixed(2)}% ROI
            </span>
            <span className="font-label-badge text-label-badge text-text-secondary">
              ({delta >= 0 ? "+" : "-"}
              {formatMoney(Math.abs(delta))})
            </span>
          </div>
        </div>

        <SlotDeck slots={tradeUp.slots} fillable={tradeUp.fillable} onToggle={tradeUp.toggleSlot} onSmartFill={tradeUp.smartFill} />
      </div>

      <OutcomeOdds outcomes={contract.outcomes} seed={contract.seed} input={tradeUp.input} />

      <div className="flex flex-col gap-2 pt-space-xs">
        <Button
          variant={null}
          size={null}
          onClick={tradeUp.ignite}
          disabled={calculating}
          className="h-auto w-full gap-2 rounded-xl border-0 bg-primary-container py-3 whitespace-normal font-headline-sm text-headline-sm font-semibold tracking-wide text-on-primary uppercase shadow-lg transition-transform active:scale-[0.98] disabled:opacity-100"
        >
          <Icon name={calculating ? "progress_activity" : "whatshot"} className={calculating ? "animate-spin text-[20px]" : "text-[24px]"} />
          <span>{calculating ? "Calculating Float Matrix..." : `Ignite Contract (${contract.bot})`}</span>
        </Button>
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="h-2 w-2 rounded-full bg-status-live" />
          <span className="font-label-badge text-label-badge text-text-secondary">Instant Steam Automated Trade Dispatch • P2P Secured</span>
        </div>
      </div>

      <ForgeResultDialog result={tradeUp.result} input={tradeUp.input} bot={contract.bot} onCollect={tradeUp.collect} />
    </div>
  );
}
