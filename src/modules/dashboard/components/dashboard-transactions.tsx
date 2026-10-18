"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardTransaction } from "../types";

export function DashboardTransactions({ transactions }: { transactions: DashboardTransaction[] }) {
  const [filter, setFilter] = React.useState<string>("all");
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const filtered = transactions.filter((t) => (filter === "all" ? true : t.kind === filter));

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatUsd = (cents: number) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
        <div>
          <CardTitle className="text-sm font-heading font-bold text-text-primary">
            Audited Treasury & Vault Ledger
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Cryptographic settlement receipts, on-chain deposits, and cashouts
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-surface-container border border-border-subtle text-xs">
          {["all", "deposit", "purchase", "sale", "withdrawal", "promo"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted font-mono">
            No transactions found for &quot;{filter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Movement / Venue</th>
                  <th className="pb-3 font-semibold">Settlement Hash</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {filtered.map((tx) => {
                  const isCredit = tx.direction === "credit";
                  return (
                    <tr key={tx.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-1.5 rounded-md ${
                              isCredit
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowDownLeft className="size-3.5" />
                            ) : (
                              <ArrowUpRight className="size-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">{tx.title}</span>
                            <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono mt-0.5">
                              <span className="uppercase px-1 rounded bg-surface-container border border-border-subtle">
                                {tx.venue}
                              </span>
                              <span>{new Date(tx.occurredAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-text-muted">
                        {tx.hash ? (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(tx.hash!)}
                            className="flex items-center gap-1 hover:text-text-primary transition-colors"
                          >
                            <span>
                              {tx.hash.length > 20
                                ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`
                                : tx.hash}
                            </span>
                            {copiedHash === tx.hash ? (
                              <Check className="size-3 text-emerald-400" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        ) : (
                          "Internal Ledger"
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase ${
                            tx.status === "settled"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : tx.status === "pending"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold">
                        <span className={isCredit ? "text-emerald-400" : "text-text-primary"}>
                          {isCredit ? "+" : "-"}
                          {formatUsd(tx.amountCents)}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-text-muted">
                        {formatUsd(tx.balanceAfterCents)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
