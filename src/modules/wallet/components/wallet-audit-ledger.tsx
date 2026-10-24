"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import type { WalletTransaction } from "../types";
import { walletSearchParams } from "../lib/search-params";
import { WalletAuditTable } from "./wallet-audit-table";

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

function exportCsv(transactions: WalletTransaction[], range: string) {
  if (transactions.length === 0) {
    toast.error("No transactions to export in current filter");
    return;
  }
  const headers = ["ID", "Title", "Hash", "Asset", "Detail", "Node", "Amount", "Status", "Kind", "Status Hint"];
  const rows = transactions.map((t) => [
    t.id,
    `"${(t.title ?? "").replace(/"/g, '""')}"`,
    `"${(t.hash ?? "").replace(/"/g, '""')}"`,
    `"${(t.asset ?? "").replace(/"/g, '""')}"`,
    `"${(t.detail ?? "").replace(/"/g, '""')}"`,
    `"${(t.node ?? "").replace(/"/g, '""')}"`,
    `"${(t.amount ?? "").replace(/"/g, '""')}"`,
    `"${(t.status ?? "").replace(/"/g, '""')}"`,
    `"${(t.kind ?? "").replace(/"/g, '""')}"`,
    `"${(t.statusHint ?? "").replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `relicto-wallet-audit-${range.toLowerCase().replace(/\s+/g, "-")}-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("Audit ledger exported", { description: `Downloaded ${transactions.length} records as CSV.` });
}

export function WalletAuditLedger({ transactions }: { transactions: WalletTransaction[] }) {
  const t = useTranslations("wallet");
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
            <h3 className="font-headline-sm text-headline-sm text-text-primary">{t("auditTitle")}</h3>
            <p className="font-body-sm text-body-sm text-text-secondary">{t("auditSubtitle")}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-xs">
          <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-1.5">
            <span className="font-label-badge text-[10px] text-text-muted">{t("totalDeposited")}</span>
            <span className="font-data-mono-md text-body-sm font-bold text-tertiary">{formatTotal(totals.deposited)}</span>
          </div>
          <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-1.5">
            <span className="font-label-badge text-[10px] text-text-muted">{t("totalWithdrawn")}</span>
            <span className="font-data-mono-md text-body-sm font-bold text-primary">{formatTotal(totals.withdrawn)}</span>
          </div>
          <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-1.5">
            <span className="font-label-badge text-[10px] text-text-muted">{t("netFlow")}</span>
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
            placeholder={t("searchLedger")}
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
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={() => exportCsv(visible, range)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-0 bg-surface-container-high px-space-md py-2 font-label-caps text-[11px] text-text-primary uppercase transition-colors hover:bg-surface-container-highest focus-visible:outline-hidden"
          >
            <Icon name="file_download" className="text-[16px]" />
            <span>{t("exportCsv")}</span>
          </Button>
        </div>
      </div>

      <WalletAuditTable visible={visible} totalCount={transactions.length} range={range} />
    </section>
  );
}
