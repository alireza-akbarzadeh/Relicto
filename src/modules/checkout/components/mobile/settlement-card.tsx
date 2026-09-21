"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useMobileCheckout } from "../../hooks/use-mobile-checkout";
import type { CheckoutMobile } from "../../mobile.types";

const ROW = "font-body-md text-[13px] text-text-secondary";
const TONE = { rose: "text-primary", indigo: "text-secondary", muted: "text-text-muted" };

/** Steam handshake, rail picker with remaining vault balance, and the fee breakdown. */
export function SettlementCard({ data }: { data: CheckoutMobile }) {
  const { rail, setRail, items, subtotal, fee, total, remainingUsd } = useMobileCheckout(data);

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-space-sm shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
            <span className="font-label-caps text-[11px] tracking-wider text-text-primary uppercase">{data.handshake.status}</span>
          </div>
          <span className="font-label-badge text-[10px] font-bold text-tertiary">{data.handshake.hold}</span>
        </div>
        <div className="flex items-center justify-between rounded bg-surface-container-lowest px-2.5 py-1.5">
          <div className="flex flex-col">
            <span className="font-label-badge text-[9px] text-text-muted uppercase">Bot Security Passphrase</span>
            <span className="font-data-mono-md text-[13px] font-bold tracking-wider text-text-primary">{data.handshake.passphrase}</span>
          </div>
          <div className="flex items-center gap-1 text-status-upcoming">
            <Icon name="verified" className="text-[18px]" />
            <span className="font-label-badge text-[10px] font-bold uppercase">API Armed</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-space-xs">
        <span className="font-label-caps text-label-caps text-text-secondary uppercase">Select Liquidity Rail</span>
        <div className="grid grid-cols-3 gap-2">
          {data.rails.map((option) => {
            const active = option.id === rail.id;
            return (
              <Button
                key={option.id}
                variant={null}
                size={null}
                aria-pressed={active}
                onClick={() => setRail(option.id)}
                className={cn(
                  "relative h-auto flex-col items-stretch justify-start rounded-lg border-0 p-2.5 text-left font-normal transition-all",
                  active ? "bg-surface-container shadow-md" : "bg-surface-container-low opacity-75 shadow-xs",
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <Icon name={option.icon} className={cn("text-[18px]", TONE[option.tone])} />
                  <span className={cn("h-2 w-2 rounded-full", active ? "bg-primary" : "bg-transparent")} />
                </span>
                <span className={cn("mt-1.5 font-label-caps text-[11px] leading-none font-bold", active ? "text-text-primary" : "text-text-secondary")}>{option.label}</span>
                <span className={cn("mt-1 font-data-mono-md text-[11px]", option.id === "vault" ? "text-tertiary" : "text-text-muted")}>
                  {option.id === "vault" ? formatMoney(data.vaultUsd) : option.note}
                </span>
              </Button>
            );
          })}
        </div>
        {rail.id === "vault" && (
          <div className="mt-1 flex items-center justify-between rounded bg-surface-container-high/60 p-2">
            <div className="flex items-center gap-1.5">
              <Icon name={remainingUsd >= 0 ? "check_circle" : "error"} className={cn("text-[16px]", remainingUsd >= 0 ? "text-tertiary" : "text-error")} />
              <span className="font-body-sm text-[12px] text-text-secondary">{remainingUsd >= 0 ? "Remaining balance after settlement:" : "Top up needed before settlement:"}</span>
            </div>
            <span className={cn("font-data-mono-md text-[12px] font-bold", remainingUsd >= 0 ? "text-tertiary" : "text-error")}>{formatMoney(Math.abs(remainingUsd))} USD</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-surface-container p-space-sm shadow-md">
        <div className="flex items-center justify-between">
          <span className={ROW}>Subtotal ({items.length} Assets)</span>
          <span className="font-data-mono-md text-[13px] font-bold text-text-primary">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={ROW}>Steam Escrow Bot Protection</span>
            <span className="rounded bg-tertiary/20 px-1 font-label-badge text-[9px] font-bold text-tertiary">PROMOTED</span>
          </div>
          <span className="font-data-mono-md text-[13px] font-bold text-tertiary">FREE</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={ROW}>{fee ? `Card Processing (${rail.feePct}%)` : "Instant Delivery SLA (<60s)"}</span>
            {!fee && <Icon name="bolt" className="text-[14px] text-status-upcoming" />}
          </div>
          <span className="font-data-mono-md text-[13px] font-semibold text-status-upcoming">{fee ? formatMoney(fee) : "Included"}</span>
        </div>
        <div className="my-1 h-px w-full bg-surface-container-high" />
        <div className="flex items-baseline justify-between">
          <span className="font-headline-sm text-[16px] tracking-wide text-text-primary uppercase">Total Payable</span>
          <div className="flex items-baseline gap-1">
            <span className="font-data-mono-lg text-[22px] font-bold text-tertiary">{formatMoney(total)}</span>
            <span className="font-label-badge text-[11px] text-text-muted">USD</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-surface-container-lowest p-2.5">
        <Icon name="gavel" className="shrink-0 text-[20px] text-primary" />
        <p className="font-body-sm text-[11px] leading-tight text-text-secondary">
          Funds are sequestered in a 256-bit multi-sig Vault. Release is automated strictly upon Steam API verification of item transfer to your backpack.
        </p>
      </div>
    </>
  );
}
