"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { WalletTransaction } from "../types";
import { walletSearchParams } from "../lib/search-params";

const TYPE_OPTIONS: readonly SelectOption<string>[] = [
  "All Transactions",
  "Deposits Only",
  "Withdrawals Only",
  "Marketplace Sales",
  "Marketplace Purchases",
].map((label) => ({ value: label, label }));

const RANGE_OPTIONS: readonly SelectOption<string>[] = ["Last 30 Days", "This Quarter", "Year to Date", "All-Time Archive"].map((label) => ({
  value: label,
  label,
}));

const STATUS_STYLE: Record<WalletTransaction["statusTone"], { text: string; dot: string; pulse?: boolean }> = {
  live: { text: "text-tertiary", dot: "bg-status-live", pulse: true },
  cyan: { text: "text-status-upcoming", dot: "bg-status-upcoming" },
  amber: { text: "text-error", dot: "bg-error" },
};

function matchesType(transaction: WalletTransaction, type: string) {
  if (type === "All Transactions") return true;
  if (type === "Deposits Only") return transaction.kind === "deposit";
  if (type === "Withdrawals Only") return transaction.kind === "withdrawal";
  if (type === "Marketplace Sales") return transaction.kind === "sale";
  if (type === "Marketplace Purchases") return transaction.kind === "purchase";
  return true;
}

function parseAmount(amount: string) {
  const numeric = Number(amount.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

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

export function WalletAuditLedger({ transactions }: { transactions: WalletTransaction[] }) {
  const [{ q: query, type, range }, setParams] = useQueryStates(walletSearchParams, { history: "replace", clearOnDefault: true });
  const setQuery = (value: string) => void setParams({ q: value });
  const setType = (value: string) => void setParams({ type: value as (typeof walletSearchParams.type)["defaultValue"] });
  const setRange = (value: string) => void setParams({ range: value as (typeof walletSearchParams.range)["defaultValue"] });

  const visible = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          matchesType(transaction, type) &&
          `${transaction.title} ${transaction.hash} ${transaction.asset} ${transaction.node} ${transaction.status}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [transactions, query, type],
  );

  const totals = useMemo(() => {
    let deposited = 0;
    let withdrawn = 0;
    for (const row of transactions) {
      const value = parseAmount(row.amount);
      if (value > 0) deposited += value;
      if (value < 0) withdrawn += Math.abs(value);
    }
    return { deposited, withdrawn, net: deposited - withdrawn };
  }, [transactions]);

  const formatTotal = (value: number) =>
    `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="flex flex-col justify-between gap-space-md xl:flex-row xl:items-center">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-text-primary">
            <Icon name="receipt_long" className="text-[20px]" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-text-primary">Cryptographic Treasury Audit Ledger</h3>
            <p className="font-body-sm text-body-sm text-text-secondary">Immutable log of deposits, cashouts, and marketplace settlements.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-xs">
          <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-1.5">
            <span className="font-label-badge text-[10px] text-text-muted">TOTAL DEPOSITED:</span>
            <span className="font-data-mono-md text-body-sm font-bold text-tertiary">{formatTotal(totals.deposited)}</span>
          </div>
          <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-1.5">
            <span className="font-label-badge text-[10px] text-text-muted">TOTAL CASHED OUT:</span>
            <span className="font-data-mono-md text-body-sm font-bold text-primary">{formatTotal(totals.withdrawn)}</span>
          </div>
          <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-1.5">
            <span className="font-label-badge text-[10px] text-text-muted">NET FLOW:</span>
            <span className="font-data-mono-md text-body-sm font-bold text-status-upcoming">
              {totals.net >= 0 ? "+" : "-"}
              {formatTotal(Math.abs(totals.net))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-space-xs rounded-lg bg-surface-card px-space-sm py-1.5">
          <Icon name="search" className="text-[18px] text-text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by Tx Hash, item, Steam trade ID, or status..."
            aria-label="Search treasury transactions"
            className="h-auto border-0 bg-transparent p-0 font-body-sm text-body-sm text-text-primary focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-wrap items-center gap-space-xs">
          <Select
            label="Filter transactions"
            value={type}
            onValueChange={setType}
            options={TYPE_OPTIONS}
            triggerClassName="cursor-pointer rounded-lg bg-surface-card px-space-sm py-2 pr-7 font-label-caps text-[11px] text-text-secondary uppercase"
            iconClassName="absolute top-2.5 right-2 text-[16px] text-text-muted"
          />
          <Select
            label="Filter date range"
            value={range}
            onValueChange={setRange}
            options={RANGE_OPTIONS}
            triggerClassName="cursor-pointer rounded-lg bg-surface-card px-space-sm py-2 pr-7 font-label-caps text-[11px] text-text-secondary uppercase"
            iconClassName="absolute top-2.5 right-2 text-[16px] text-text-muted"
          />
          <NoticeButton
            notice={{ title: "Audit export queued", description: "CSV and tax reports download once the wallet API is wired." }}
            className="h-auto gap-1 rounded-lg border-0 bg-surface-container-high px-space-md py-2 font-label-caps text-[11px] text-text-primary uppercase hover:bg-surface-container-highest"
          >
            <Icon name="file_download" className="text-[16px]" />
            <span>CSV / Tax Audit</span>
          </NoticeButton>
        </div>
      </div>

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
                    <NoticeButton
                      notice={{ title: transaction.action, description: transaction.statusHint }}
                      className="inline-flex h-auto gap-0.5 rounded-none border-0 p-0 font-label-caps text-[11px] text-text-secondary uppercase hover:text-text-primary"
                    >
                      <span>{transaction.action}</span>
                      <Icon name={transaction.actionIcon} className="text-[14px]" />
                    </NoticeButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-space-sm pt-space-xs sm:flex-row">
        <span className="font-data-mono-md text-body-sm text-text-muted">
          Showing {visible.length} of {transactions.length} verified {range.toLowerCase()} entries
        </span>
      </div>
    </section>
  );
}
