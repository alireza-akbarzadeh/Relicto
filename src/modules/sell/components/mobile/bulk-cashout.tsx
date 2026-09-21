"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useBulkCashout } from "../../hooks/use-bulk-cashout";
import type { SellMobile } from "../../mobile.types";

/** Tick skins to liquidate instantly; the gross value and cashout button follow the picks. */
export function BulkCashout({ cashout }: { cashout: SellMobile["cashout"] }) {
  const { isSelected, count, totalUsd, toggle } = useBulkCashout(cashout.rows);
  const total = formatMoney(totalUsd);

  const execute = () => {
    if (!count) {
      toast.error("Select at least one skin to liquidate");
      return;
    }
    toast.success(`Cashout of ${total} dispatched`, { description: `${count} skins to ${cashout.rail}. ${cashout.arrival}.` });
  };

  return (
    <div id="bulk-cashout" className="mt-space-lg flex scroll-mt-20 flex-col gap-space-sm px-margin">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="payments" className="text-[20px] text-tertiary" />
          <span className="font-headline-sm text-headline-sm text-text-primary">Bulk Instant Cashout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-label-badge text-label-badge text-status-upcoming">{count} Selected</span>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-card p-space-md shadow-md">
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex flex-col">
            <span className="font-label-badge text-label-badge text-text-secondary uppercase">Gross Cashout Value</span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile leading-tight text-tertiary">{total}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 rounded-lg bg-surface-container px-2 py-1">
              <Icon name="flash_on" className="text-[14px] text-tertiary" />
              <span className="font-label-badge text-label-badge text-text-primary">{cashout.rail}</span>
            </div>
            <span className="mt-1 font-label-badge text-[10px] text-text-secondary">{cashout.arrival}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {cashout.rows.map((row) => {
            const on = isSelected(row.id);
            return (
              <div key={row.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-2 shadow-xs">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Button
                    variant={null}
                    size={null}
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`Liquidate ${row.name}`}
                    onClick={() => toggle(row.id)}
                    className={cn("h-5 w-5 shrink-0 rounded border-0", on ? "bg-primary-container text-on-primary" : "bg-surface-container-highest text-text-muted")}
                  >
                    <Icon name="check" className={cn("text-[15px]", !on && "opacity-0")} />
                  </Button>
                  <Image src={row.image} alt={row.imageAlt} width={80} height={64} sizes="40px" className="h-8 w-10 shrink-0 rounded bg-surface-container-highest object-contain" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-body-md text-body-md leading-tight font-semibold text-text-primary">{row.name}</span>
                    <span className="font-label-badge text-[10px] text-text-secondary">{row.wear}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end pl-2">
                  <span className="font-data-mono-md text-data-mono-md text-tertiary">{formatMoney(row.priceUsd)}</span>
                  <span className="font-label-badge text-[9px] text-status-upcoming">Instant 100%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 pt-space-xs">
          <Button
            variant={null}
            size={null}
            onClick={execute}
            className="h-auto w-full gap-2 rounded-xl border-0 bg-surface-container-highest py-3 font-headline-sm text-body-md font-normal text-text-primary shadow-md transition-all hover:bg-surface-container active:scale-[0.98]"
          >
            <Icon name="account_balance_wallet" className="text-[20px] text-tertiary" />
            <span>Cashout {total} to Vault or USDT</span>
          </Button>
          <div className="flex items-center justify-between px-1">
            <span className="font-label-badge text-[10px] text-text-secondary">Zero Steam Market 15% Tax Penalty</span>
            <span className="font-label-badge text-[10px] font-semibold text-status-upcoming">Verified Bot Cluster Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
