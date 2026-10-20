"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { WalletTransaction } from "@/modules/wallet/types";

type KindFilter = "all" | "deposit" | "purchase" | "sale" | "withdrawal";

export function TransactionsTable({ transactions = [] }: { transactions?: WalletTransaction[] }) {
  const [filter, setFilter] = useState<KindFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((tx) => tx.kind === filter);
  }, [transactions, filter]);

  return (
    <section className="flex flex-col gap-space-md">
      {/* Header bar */}
      <div className="flex flex-col justify-between gap-space-sm rounded-xl border border-white/6 bg-surface-card p-space-md sm:flex-row sm:items-center">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Icon name="receipt_long" className="text-[20px] text-amber-400" />
            <h2 className="font-headline-sm text-base font-bold text-text-primary uppercase">
              Audit Ledger &amp; Transaction History
            </h2>
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-data-mono-md text-xs font-bold text-amber-400">
              {transactions.length} Records
            </span>
          </div>
          <p className="font-body-sm text-xs text-text-muted">
            Append-only financial statement tracking all on-chain crypto ingress, skin payouts, and escrow releases.
          </p>
        </div>

        <Link
          href="/wallet"
          className="flex items-center gap-1 self-start rounded-lg bg-surface-container-high px-3 py-1.5 font-headline-sm text-xs font-semibold text-text-primary uppercase hover:bg-surface-bright sm:self-auto"
        >
          <Icon name="account_balance_wallet" className="text-[14px]" />
          <span>Open Vault</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            { id: "all", label: `All (${transactions.length})` },
            { id: "deposit", label: `Deposits (${transactions.filter((t) => t.kind === "deposit").length})` },
            { id: "purchase", label: `Purchases (${transactions.filter((t) => t.kind === "purchase").length})` },
            { id: "sale", label: `Sales (${transactions.filter((t) => t.kind === "sale").length})` },
            { id: "withdrawal", label: `Cashouts (${transactions.filter((t) => t.kind === "withdrawal").length})` },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.id}
            variant={null}
            size={null}
            onClick={() => setFilter(tab.id)}
            className={`h-auto rounded-lg px-3 py-1.5 font-headline-sm text-xs font-semibold uppercase transition-colors ${
              filter === tab.id
                ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                : "bg-surface-card text-text-muted hover:bg-surface-container hover:text-text-primary"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Transactions Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-white/6 bg-surface-card shadow-md">
          <table className="w-full text-left font-body-sm text-xs text-text-primary">
            <thead className="border-b border-white/6 bg-surface-container-lowest/80 font-label-caps text-[11px] text-text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Event / Operation</th>
                <th className="px-4 py-3">Audit Hash &amp; Route</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map((tx) => {
                const isCredit = tx.amount.startsWith("+");
                return (
                  <tr key={tx.id} className="transition-colors hover:bg-surface-container-high/60">
                    {/* Event & Asset */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isCredit ? "bg-amber-400/10 text-amber-400" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon name={tx.icon} className="text-[16px]" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-headline-sm text-xs font-bold text-text-primary">
                            {tx.title}
                          </span>
                          <span className="truncate font-body-sm text-[11px] text-text-muted">
                            {tx.asset || tx.detail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Hash & Node */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-data-mono-md text-[11px] text-slate-300">
                          {tx.hash}
                        </span>
                        <span className="truncate font-body-sm text-[10px] text-text-muted">
                          {tx.node || tx.detail}
                        </span>
                      </div>
                    </td>

                    {/* Kind Badge */}
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-badge text-[10px] uppercase text-text-secondary">
                        {tx.kind}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 text-right font-data-mono-lg text-sm font-bold">
                      <span className={isCredit ? "text-amber-400" : "text-primary"}>
                        {tx.amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 font-label-badge text-[10px] font-semibold ${
                          tx.statusTone === "live"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : tx.statusTone === "cyan"
                              ? "bg-cyan-500/15 text-cyan-300"
                              : "bg-amber-400/15 text-amber-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      {tx.action && (
                        <span className="inline-flex items-center gap-1 font-headline-sm text-[11px] font-semibold text-text-secondary hover:text-text-primary">
                          <span>{tx.action}</span>
                          <Icon name={tx.actionIcon} className="text-[12px]" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-space-md rounded-xl border border-dashed border-white/10 bg-surface-card/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-text-muted">
            <Icon name="receipt_long" className="text-[24px]" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <span className="font-headline-sm text-sm font-bold text-text-primary">
              No transactions under &apos;{filter}&apos;
            </span>
            <span className="font-body-sm text-xs text-text-muted">
              Select &apos;All&apos; or perform a wallet deposit to record your first on-chain audit entry.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
