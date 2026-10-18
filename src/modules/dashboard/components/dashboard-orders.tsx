"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, Ban, Bot, User, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardOrder } from "../types";
import { OrdersFilterBar, type OrdersFilterState } from "./orders-filter-bar";

const INITIAL_FILTERS: OrdersFilterState = {
  search: "",
  state: "all",
  flow: "all",
  sortBy: "newest",
};

export function DashboardOrders({ orders }: { orders: DashboardOrder[] }) {
  const [filters, setFilters] = React.useState<OrdersFilterState>(INITIAL_FILTERS);

  const handleFilterChange = <K extends keyof OrdersFilterState>(key: K, value: OrdersFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setFilters(INITIAL_FILTERS);

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = orders.filter((o) => {
      const matchSearch =
        !q ||
        o.code.toLowerCase().includes(q) ||
        o.itemName.toLowerCase().includes(q) ||
        (o.counterpartyName ?? "").toLowerCase().includes(q);
      const matchState = filters.state === "all" || o.state === filters.state;
      const matchFlow = filters.flow === "all" || o.flow === filters.flow;
      return matchSearch && matchState && matchFlow;
    });

    return result.sort((a, b) => {
      if (filters.sortBy === "newest") return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
      if (filters.sortBy === "total_desc") return b.totalCents - a.totalCents;
      if (filters.sortBy === "total_asc") return a.totalCents - b.totalCents;
      if (filters.sortBy === "fee_desc") return b.feeCents - a.feeCents;
      return 0;
    });
  }, [orders, filters]);

  const formatUsd = (cents: number) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary">
              Live Order Stream & Escrow Handoffs
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Active multi-sig escrows, tradebot offers, and verified settlements
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Showing: <strong className="text-text-primary">{filteredAndSorted.length}</strong> / {orders.length}
          </span>
        </div>

        <OrdersFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          filteredCount={filteredAndSorted.length}
          filteredOrders={filteredAndSorted}
        />
      </CardHeader>
      <CardContent>
        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted font-mono border border-dashed border-border-subtle rounded-lg">
            <Inbox className="size-6 text-text-muted mx-auto mb-2 opacity-50" />
            No orders match current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Order / Item</th>
                  <th className="pb-3 font-semibold">Flow</th>
                  <th className="pb-3 font-semibold">Counterparty</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Settled Total</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {filteredAndSorted.map((order) => {
                  const isEscrow = order.state === "escrow";
                  const isCompleted = order.state === "completed";
                  return (
                    <tr key={order.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="py-3">
                        <span className="font-mono text-xs font-bold text-text-primary block">{order.code}</span>
                        <span className="text-xs text-text-muted line-clamp-1">{order.itemName}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            order.flow === "buy"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : order.flow === "sell"
                                ? "bg-primary/10 text-primary"
                                : "bg-cyan-500/10 text-cyan-400"
                          }`}
                        >
                          {order.flow}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-text-secondary">
                        <span className="flex items-center gap-1">
                          {order.counterpartyKind === "bot" ? (
                            <Bot className="size-3 text-cyan-400" />
                          ) : (
                            <User className="size-3 text-text-muted" />
                          )}
                          {order.counterpartyName ?? "Relicto Escrow Bot"}
                        </span>
                      </td>
                      <td className="py-3">
                        {isEscrow && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Clock className="size-3 animate-pulse" /> Escrow Active
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="size-3" /> Settled
                          </span>
                        )}
                        {!isEscrow && !isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-surface-container text-text-muted border border-border-subtle">
                            <Ban className="size-3" /> {order.state}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-text-primary">
                        {formatUsd(order.totalCents)}
                        {order.feeCents > 0 && (
                          <span className="block text-[10px] font-normal text-text-muted">
                            Fee: {formatUsd(order.feeCents)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/orders/${order.code}`}>
                          <Button size="xs" variant="ghost" className="gap-1 text-[11px] font-mono">
                            Inspect <ArrowUpRight className="size-3" />
                          </Button>
                        </Link>
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
