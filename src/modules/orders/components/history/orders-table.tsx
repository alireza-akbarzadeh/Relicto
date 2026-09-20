"use client";

import { useState } from "react";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { LedgerRow } from "../../types";
import { OrderRow } from "./order-row";

/** Column widths mirror the Stitch layout (a fixed table keeps the dense row content aligned). */
const COLUMNS = [
  { label: "Order ID & Date", width: "w-[11.2%]" },
  { label: "Item & Metadata", width: "w-[25%]" },
  { label: "Method & Flow", width: "w-[10.1%]" },
  { label: "Bot / Counterparty", width: "w-[17.9%]" },
  { label: "Settlement", width: "w-[10.6%]" },
  { label: "State", width: "w-[12.6%]" },
  { label: "Actions", width: "w-[12.6%]" },
];
const PAGE_BUTTON = "h-auto rounded border-0 px-space-sm py-1 font-label-badge text-label-badge";
const STEP_BUTTON = "h-auto rounded border-0 bg-surface-container p-1.5 transition-colors hover:bg-surface-bright";

type OrdersTableProps = { rows: LedgerRow[]; total: number; pages: number };

/** The ledger table with its record footnote and pagination. */
export function OrdersTable({ rows, total, pages }: OrdersTableProps) {
  const [page, setPage] = useState(1);
  const shown = rows.length ? `1 - ${rows.length}` : "0";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-high font-label-caps text-label-caps tracking-wider text-text-muted uppercase">
              {COLUMNS.map((column, index) => (
                <th
                  key={column.label}
                  className={cn(
                    "py-space-md",
                    column.width,
                    index === 0 || index === COLUMNS.length - 1 ? "px-space-lg" : "px-space-md",
                    (index === 4 || index === COLUMNS.length - 1) && "text-right",
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md">
            {rows.map((row, index) => (
              <OrderRow key={row.id} row={row} alt={index % 2 === 1} />
            ))}
            {rows.length === 0 && (
              <tr className="bg-surface-container-lowest">
                <td colSpan={COLUMNS.length} className="px-space-lg py-space-xl text-center font-body-sm text-body-sm text-text-muted">
                  No transactions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-space-md bg-surface-container-high px-space-lg py-space-md sm:flex-row">
        <div className="flex items-center gap-space-xs font-label-badge text-label-badge text-text-muted">
          <span>Showing</span>
          <span className="font-data-mono-md font-bold text-text-primary">{shown}</span>
          <span>of</span>
          <span className="font-data-mono-md font-bold text-text-primary">{total}</span>
          <span>transactions</span>
        </div>
        <div className="flex items-center gap-space-xs">
          <NoticeButton
            notice={{ title: "First page", description: "You are already on the first page." }}
            disabled={page === 1}
            aria-label="Previous page"
            className={cn(STEP_BUTTON, "text-text-muted hover:text-text-primary disabled:opacity-40")}
          >
            <Icon name="chevron_left" className="text-[18px]" />
          </NoticeButton>
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <NoticeButton
              key={number}
              notice={{ title: `Page ${number}`, description: "Paging loads more rows once the orders API is wired." }}
              onClickCapture={() => setPage(number)}
              aria-current={page === number ? "page" : undefined}
              className={cn(
                PAGE_BUTTON,
                page === number
                  ? "bg-primary-container font-bold text-on-primary-container"
                  : "bg-surface-container text-text-secondary hover:bg-surface-bright",
              )}
            >
              {number}
            </NoticeButton>
          ))}
          <NoticeButton
            notice={{ title: `Page ${Math.min(page + 1, pages)}`, description: "Paging loads more rows once the orders API is wired." }}
            onClickCapture={() => setPage((current) => Math.min(current + 1, pages))}
            aria-label="Next page"
            className={cn(STEP_BUTTON, "text-text-secondary hover:text-text-primary")}
          >
            <Icon name="chevron_right" className="text-[18px]" />
          </NoticeButton>
        </div>
      </div>
    </div>
  );
}
