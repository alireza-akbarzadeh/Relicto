"use client";

import { LedgerFooter } from "@/modules/relicto/components/shell/footers";
import { LedgerHeader } from "@/modules/relicto/components/shell/ledger-header";
import { useOrderFilters } from "../hooks/use-order-filters";
import type { LedgerData } from "../types";
import { FilterBar } from "./history/filter-bar";
import { LedgerIntro } from "./history/ledger-intro";
import { LedgerStats } from "./history/ledger-stats";
import { OrdersTable } from "./history/orders-table";
import { SlaBanner } from "./history/sla-banner";

/** Stitch: "Relicto — Order History & Trade Ledger". */
export function HistoryView({ data }: { data: LedgerData }) {
  const filters = useOrderFilters(data.rows);

  return (
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
      <LedgerHeader />
      <main className="w-full pt-20">
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-secondary-container/15 blur-3xl" />
          <div className="flex w-full flex-col gap-space-lg px-gutter-desktop py-space-lg">
            <LedgerIntro poll={data.poll} vault={data.vault} />
            <LedgerStats stats={data.stats} active={data.active} />
            <FilterBar
              counts={data.counts}
              tab={filters.tab}
              onTab={filters.setTab}
              game={filters.game}
              onGame={filters.setGame}
              range={filters.range}
              onRange={filters.setRange}
              query={filters.query}
              onQuery={filters.setQuery}
            />
            <OrdersTable rows={filters.visible} total={data.total} pages={data.pages} />
            <SlaBanner />
          </div>
        </div>
      </main>
      <LedgerFooter />
    </div>
  );
}
