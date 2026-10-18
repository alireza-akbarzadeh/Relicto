"use client";

import * as React from "react";
import { Scale, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardDispute } from "../types";
import { DisputesFilterBar, type DisputesFilterState } from "./disputes-filter-bar";
import { resolveDisputeAction } from "../actions/admin-disputes";

const INITIAL_FILTERS: DisputesFilterState = {
  search: "",
  status: "all",
  sortBy: "newest",
};

export function DashboardDisputes({ disputes: initialDisputes }: { disputes: DashboardDispute[] }) {
  const [disputes, setDisputes] = React.useState(initialDisputes);
  const [filters, setFilters] = React.useState<DisputesFilterState>(INITIAL_FILTERS);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleFilterChange = <K extends keyof DisputesFilterState>(key: K, value: DisputesFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setFilters(INITIAL_FILTERS);

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = disputes.filter((d) => {
      const matchSearch =
        !q ||
        d.orderCode.toLowerCase().includes(q) ||
        d.itemName.toLowerCase().includes(q) ||
        d.buyerName.toLowerCase().includes(q) ||
        d.sellerName.toLowerCase().includes(q);
      const matchStatus = filters.status === "all" || d.status === filters.status;
      return matchSearch && matchStatus;
    });

    return result.sort((a, b) => {
      if (filters.sortBy === "newest") return new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime();
      if (filters.sortBy === "amount_desc") return b.amountCents - a.amountCents;
      return 0;
    });
  }, [disputes, filters]);

  const handleResolve = async (disputeId: string, decision: "refund_buyer" | "release_seller") => {
    setLoadingId(disputeId);
    try {
      const res = await resolveDisputeAction(disputeId, decision);
      if (res.success) {
        toast.success(res.message);
        const nextStatus = decision === "refund_buyer" ? "resolved_buyer" : "resolved_seller";
        setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: nextStatus } : d)));
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const formatUsd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <Scale className="size-4 text-amber-400" />
              Escrow Disputes & Arbitration Chamber
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Review trade confirmation disputes, inspect buyer/seller evidence, and arbitrate fund settlements
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Active Disputes: <strong className="text-amber-400">{filteredAndSorted.length}</strong> / {disputes.length}
          </span>
        </div>

        <DisputesFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          filteredCount={filteredAndSorted.length}
          filteredDisputes={filteredAndSorted}
        />
      </CardHeader>

      <CardContent>
        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted font-mono border border-dashed border-border-subtle rounded-lg">
            <ShieldCheck className="size-6 text-emerald-400 mx-auto mb-2 opacity-50" />
            No open disputes pending admin arbitration.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Case / Item</th>
                  <th className="pb-3 font-semibold">Parties</th>
                  <th className="pb-3 font-semibold">Dispute Reason</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Escrow Sum</th>
                  <th className="pb-3 font-semibold text-right">Arbitration Ruling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {filteredAndSorted.map((d) => {
                  const isPending = d.status === "open" || d.status === "under_review";
                  return (
                    <tr key={d.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="py-3">
                        <span className="font-mono text-xs font-bold text-text-primary block">{d.orderCode}</span>
                        <span className="text-xs text-text-muted line-clamp-1">{d.itemName}</span>
                      </td>
                      <td className="py-3 font-mono text-[11px]">
                        <span className="text-cyan-400 block">Buyer: @{d.buyerName}</span>
                        <span className="text-text-muted block">Seller: @{d.sellerName}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-xs text-text-secondary line-clamp-2">{d.reason}</span>
                        <span className="text-[10px] text-text-muted flex items-center gap-1 font-mono mt-0.5">
                          <FileText className="size-3" /> {d.evidenceCount} attachments
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase ${
                            d.status === "open"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                              : d.status === "under_review"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {d.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-text-primary">
                        {formatUsd(d.amountCents)}
                      </td>
                      <td className="py-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="xs"
                              variant="destructive"
                              disabled={loadingId === d.id}
                              onClick={() => handleResolve(d.id, "refund_buyer")}
                              className="text-[10px] font-mono h-7 px-2"
                            >
                              Refund Buyer
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              disabled={loadingId === d.id}
                              onClick={() => handleResolve(d.id, "release_seller")}
                              className="text-[10px] font-mono h-7 px-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                              Release Seller
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-text-muted capitalize">
                            {d.status === "resolved_buyer" ? "Buyer Refunded" : "Seller Paid Out"}
                          </span>
                        )}
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
