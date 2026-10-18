"use client";

import * as React from "react";
import { ShieldCheck, History } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardAuditLog } from "../types";
import { AuditFilterBar, type AuditFilterState } from "./audit-filter-bar";
import { GridPagination } from "./grid-pagination";
import { auditSearchParams } from "../lib/search-params";

export function DashboardAudit({ auditLogs }: { auditLogs: DashboardAuditLog[] }) {
  const [query, setQuery] = useQueryStates(auditSearchParams, {
    history: "replace",
    shallow: true,
    clearOnDefault: true,
  });

  const filters: AuditFilterState = React.useMemo(() => ({
    search: query.aq,
    action: query.aaction,
    severity: query.aseverity as AuditFilterState["severity"],
    sortBy: query.asort as AuditFilterState["sortBy"],
  }), [query]);

  const keyMap: Record<keyof AuditFilterState, string> = {
    search: "aq", action: "aaction", severity: "aseverity", sortBy: "asort",
  };

  const handleFilterChange = <K extends keyof AuditFilterState>(key: K, value: AuditFilterState[K]) => {
    void setQuery({ [keyMap[key]]: value, apage: 1 });
  };

  const handleResetFilters = () => {
    void setQuery({ aq: "", aaction: "all", aseverity: "all", asort: "newest", apage: 1 });
  };

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = auditLogs.filter((l) => {
      const matchSearch =
        !q ||
        l.adminName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.targetId && l.targetId.toLowerCase().includes(q)) ||
        l.details.toLowerCase().includes(q);
      const matchAction = filters.action === "all" || l.action === filters.action;
      const matchSeverity = filters.severity === "all" || l.severity === filters.severity;
      return matchSearch && matchAction && matchSeverity;
    });

    return result.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return filters.sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [auditLogs, filters]);

  const paginatedLogs = React.useMemo(() => {
    const start = (query.apage - 1) * query.apageSize;
    return filteredAndSorted.slice(start, start + query.apageSize);
  }, [filteredAndSorted, query.apage, query.apageSize]);

  const severityBadge = (sev: string) => {
    if (sev === "critical") return <Badge variant="destructive" className="text-[10px] uppercase font-mono">Critical</Badge>;
    if (sev === "warning") return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] uppercase font-mono">Warning</Badge>;
    return <Badge variant="secondary" className="text-[10px] uppercase font-mono">Info</Badge>;
  };

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <History className="size-4 text-primary" />
              Administrative Audit Trail & Security Ledger
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Append-only audit stream tracking operational mutations, role updates, and dispute arbitration
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Showing <strong className="text-text-primary">{filteredAndSorted.length}</strong> / {auditLogs.length} events
          </span>
        </div>

        <AuditFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          filteredCount={filteredAndSorted.length}
          filteredLogs={filteredAndSorted}
        />
      </CardHeader>

      <CardContent className="space-y-3">
        {paginatedLogs.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-text-muted border border-dashed border-border-subtle rounded-lg">
            <ShieldCheck className="size-6 text-text-muted mx-auto mb-2 opacity-50" />
            No administrative audit events match current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-border-subtle text-[11px] uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Administrator</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">Target Entity</th>
                  <th className="pb-3 font-semibold">Details / Audit Note</th>
                  <th className="pb-3 font-semibold text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-2.5 text-text-muted text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-2.5 font-semibold text-text-primary whitespace-nowrap">
                      {log.adminName}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-surface-container border border-border-subtle text-[10px] text-primary uppercase font-bold">
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2.5 text-text-secondary text-[11px]">
                      <span className="uppercase text-text-muted text-[10px] block">{log.targetType}</span>
                      {log.targetId ? <span className="text-[10px]">{log.targetId.slice(0, 12)}...</span> : "—"}
                    </td>
                    <td className="py-2.5 text-text-primary text-xs max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      {severityBadge(log.severity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <GridPagination
          page={query.apage}
          pageSize={query.apageSize}
          totalItems={filteredAndSorted.length}
          onPageChange={(page) => void setQuery({ apage: page })}
          onPageSizeChange={(pageSize) => void setQuery({ apageSize: pageSize })}
        />
      </CardContent>
    </Card>
  );
}
