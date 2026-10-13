"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { WalletTransaction } from "../types";

const STATUS_STYLE: Record<WalletTransaction["statusTone"], { text: string; dot: string; pulse?: boolean }> = {
  live: { text: "text-tertiary", dot: "bg-status-live", pulse: true },
  cyan: { text: "text-status-upcoming", dot: "bg-status-upcoming" },
  amber: { text: "text-error", dot: "bg-error" },
};

function LedgerStatus({ transaction }: { transaction: WalletTransaction }) {
  const style = STATUS_STYLE[transaction.statusTone];
  return (
    <div className="flex max-w-45 flex-col gap-0.5">
      <span className={cn("inline-flex w-fit items-center gap-1 rounded bg-surface-container-lowest px-2 py-0.5 font-label-badge text-[10px] uppercase", style.text)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot, style.pulse && "animate-pulse")} />
        {transaction.status}
      </span>
      <span className="font-body-sm text-[11px] leading-snug text-text-muted">{transaction.statusHint}</span>
    </div>
  );
}

function handleTransactionAction(transaction: WalletTransaction) {
  const target = transaction.hash !== "—" ? transaction.hash : transaction.id;
  if (transaction.action === "TronScan" && target.length > 20 && !target.startsWith("#")) {
    window.open(`https://tronscan.org/#/transaction/${target}`, "_blank", "noopener,noreferrer");
    return;
  }
  navigator.clipboard
    .writeText(target)
    .then(() => {
      toast.success(`${transaction.action} reference copied`, { description: target });
    })
    .catch(() => {
      toast.info(`${transaction.action}: ${transaction.statusHint}`);
    });
}

export function WalletAuditTable({
  visible,
  totalCount,
  range,
}: {
  visible: WalletTransaction[];
  totalCount: number;
  range: string;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse text-left font-body-sm">
          <thead>
            <tr className="bg-surface-container-lowest font-label-caps text-[11px] text-text-muted uppercase">
              <th className="rounded-l-lg px-space-md py-3">Transaction &amp; Hash</th>
              <th className="px-space-md py-3">Asset Details / Counterparty</th>
              <th className="px-space-md py-3">Execution Node</th>
              <th className="px-space-md py-3">Amount (USD)</th>
              <th className="px-space-md py-3">Audited Status</th>
              <th className="rounded-r-lg px-space-md py-3 text-right">Proof / Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-space-md py-space-xl text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-space-sm">
                    <Icon name="inventory_2" className="text-[32px] text-text-muted" />
                    <p className="font-headline-sm text-headline-sm text-text-primary">No ledger entries yet</p>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Deposits and cashouts appear here with live status. Make a test deposit to open your vault history.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((transaction) => (
                <tr key={transaction.id} className="border-t border-border-subtle/40 transition-colors hover:bg-surface-container-high/30">
                  <td className="px-space-md py-3.5">
                    <div className="flex items-center gap-space-xs">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-high text-tertiary">
                        <Icon name={transaction.icon} className="text-[16px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-[13px] font-semibold text-text-primary">{transaction.title}</span>
                        <span className="font-data-mono-md text-[11px] text-text-muted">{transaction.hash}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-space-md py-3.5">
                    <div className="flex flex-col">
                      <span className="text-text-primary">{transaction.asset}</span>
                      <span className="font-data-mono-md text-[11px] text-text-muted">{transaction.detail}</span>
                    </div>
                  </td>
                  <td className="px-space-md py-3.5 font-data-mono-md text-[11px] text-status-upcoming">{transaction.node}</td>
                  <td className={cn("px-space-md py-3.5 font-data-mono-md text-data-mono-md font-bold", transaction.amountTone === "primary" ? "text-primary" : "text-tertiary")}>
                    {transaction.amount}
                  </td>
                  <td className="px-space-md py-3.5">
                    <LedgerStatus transaction={transaction} />
                  </td>
                  <td className="px-space-md py-3.5 text-right">
                    <Button
                      type="button"
                      variant={null}
                      size={null}
                      onClick={() => handleTransactionAction(transaction)}
                      aria-label={`${transaction.action} proof for ${transaction.hash}`}
                      className="inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent p-0 font-label-caps text-[11px] text-text-secondary uppercase transition-colors hover:text-text-primary focus-visible:outline-hidden"
                    >
                      <span>{transaction.action}</span>
                      <Icon name={transaction.actionIcon} className="text-[14px]" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-space-sm pt-space-xs sm:flex-row">
        <span className="font-data-mono-md text-body-sm text-text-muted">
          Showing {visible.length} of {totalCount} verified {range.toLowerCase()} entries
        </span>
      </div>
    </>
  );
}
