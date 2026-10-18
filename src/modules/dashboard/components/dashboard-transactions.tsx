"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, Copy, Check, Receipt } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardTransaction } from "../types";
import { TransactionsFilterBar, type TransactionsFilterState } from "./transactions-filter-bar";
import { GridPagination } from "./grid-pagination";
import { transactionsSearchParams } from "../lib/search-params";

export function DashboardTransactions({ transactions }: { transactions: DashboardTransaction[] }) {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const [query, setQuery] = useQueryStates(transactionsSearchParams, {
    history: "replace",
    shallow: true,
    clearOnDefault: true,
  });

  const filters: TransactionsFilterState = React.useMemo(() => ({
    search: query.tq,
    kind: query.tkind,
    direction: query.tdir as TransactionsFilterState["direction"],
    status: query.tstatus as TransactionsFilterState["status"],
    sortBy: query.tsort as TransactionsFilterState["sortBy"],
  }), [query]);

  const handleFilterChange = <K extends keyof TransactionsFilterState>(key: K, value: TransactionsFilterState[K]) => {
    const keyMap = { search: "tq", kind: "tkind", direction: "tdir", status: "tstatus", sortBy: "tsort" } as const;
    void setQuery({ [keyMap[key]]: value, tpage: 1 });
  };

  const handleReset = () => void setQuery({ tq: "", tkind: "all", tdir: "all", tstatus: "all", tsort: "newest", tpage: 1 });

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = transactions.filter((t) => {
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q) ||
        (t.hash ?? "").toLowerCase().includes(q);
      const matchKind = filters.kind === "all" || t.kind === filters.kind;
      const matchDirection = filters.direction === "all" || t.direction === filters.direction;
      const matchStatus = filters.status === "all" || t.status === filters.status;
      return matchSearch && matchKind && matchDirection && matchStatus;
    });

    return result.sort((a, b) => {
      if (filters.sortBy === "newest") return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      if (filters.sortBy === "amount_desc") return b.amountCents - a.amountCents;
      if (filters.sortBy === "amount_asc") return a.amountCents - b.amountCents;
      return 0;
    });
  }, [transactions, filters]);

  const paginatedTransactions = React.useMemo(() => {
    const start = (query.tpage - 1) * query.tpageSize;
    return filteredAndSorted.slice(start, start + query.tpageSize);
  }, [filteredAndSorted, query.tpage, query.tpageSize]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatUsd = (cents: number) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary">
              Audited Treasury & Vault Ledger
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Cryptographic settlement receipts, on-chain deposits, and cashouts
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Showing: <strong className="text-text-primary">{filteredAndSorted.length}</strong> / {transactions.length}
          </span>
        </div>

        <TransactionsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          filteredCount={filteredAndSorted.length}
          filteredTransactions={filteredAndSorted}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted font-mono border border-dashed border-border-subtle rounded-lg">
            <Receipt className="size-6 text-text-muted mx-auto mb-2 opacity-50" />
            No ledger transactions match current filter criteria.
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
                {paginatedTransactions.map((tx) => {
                  const isCredit = tx.direction === "credit";
                  return (
                    <tr key={tx.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-md ${isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500"}`}>
                            {isCredit ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">{tx.title}</span>
                            <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono mt-0.5">
                              <span className="uppercase px-1 rounded bg-surface-container border border-border-subtle">{tx.venue}</span>
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
                            className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
                          >
                            <span>
                              {tx.hash.length > 20 ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}` : tx.hash}
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

        <GridPagination
          page={query.tpage}
          pageSize={query.tpageSize}
          totalItems={filteredAndSorted.length}
          onPageChange={(page) => void setQuery({ tpage: page })}
          onPageSizeChange={(pageSize) => void setQuery({ tpageSize: pageSize })}
        />
      </CardContent>
    </Card>
  );
}
