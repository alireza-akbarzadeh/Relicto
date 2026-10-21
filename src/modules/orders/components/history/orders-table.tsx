"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { LedgerRow } from "../../types";
import { OrderRow } from "./order-row";

const PAGE_BUTTON = "h-auto rounded border-0 px-space-sm py-1 font-label-badge text-label-badge";
const STEP_BUTTON = "h-auto rounded border-0 bg-surface-container p-1.5 transition-colors hover:bg-surface-bright";

type OrdersTableProps = { rows: LedgerRow[]; total: number; pages: number; page: number; onPage: (page: number) => void };

/** The ledger table with its record footnote and pagination. */
export function OrdersTable({ rows, total, pages, page, onPage }: OrdersTableProps) {
  const t = useTranslations("orders");
  const shown = rows.length ? `1 - ${rows.length}` : "0";

  const columns = [
    { label: t("colOrderId"), width: "w-[11.2%]" },
    { label: t("colItem"), width: "w-[25%]" },
    { label: t("colMethod"), width: "w-[10.1%]" },
    { label: t("colParty"), width: "w-[17.9%]" },
    { label: t("colSettlement"), width: "w-[10.6%]" },
    { label: t("colState"), width: "w-[12.6%]" },
    { label: t("colActions"), width: "w-[12.6%]" },
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-high font-label-caps text-label-caps tracking-wider text-text-muted uppercase">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "py-space-md",
                    column.width,
                    index === 0 || index === columns.length - 1 ? "px-space-lg" : "px-space-md",
                    (index === 4 || index === columns.length - 1) && "text-right",
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
                <td colSpan={columns.length} className="px-space-lg py-space-xl text-center font-body-sm text-body-sm text-text-muted">
                  {t("noTransactions")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-space-md bg-surface-container-high px-space-lg py-space-md sm:flex-row">
        <div className="flex items-center gap-space-xs font-label-badge text-label-badge text-text-muted">
          <span>{t("showingRecords", { shown, total })}</span>
        </div>
        <div className="flex items-center gap-space-xs">
          <Button
            variant={null}
            size={null}
            disabled={page === 1}
            onClick={() => onPage(page - 1)}
            aria-label={t("prevPage")}
            className={cn(STEP_BUTTON, "text-text-muted hover:text-text-primary disabled:opacity-40")}
          >
            <Icon name="chevron_left" className="text-[18px]" />
          </Button>
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <Button
              key={number}
              variant={null}
              size={null}
              onClick={() => onPage(number)}
              aria-current={page === number ? "page" : undefined}
              className={cn(
                PAGE_BUTTON,
                page === number
                  ? "bg-primary-container font-bold text-on-primary-container"
                  : "bg-surface-container text-text-secondary hover:bg-surface-bright",
              )}
            >
              {number}
            </Button>
          ))}
          <Button
            variant={null}
            size={null}
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
            aria-label={t("nextPage")}
            className={cn(STEP_BUTTON, "text-text-secondary hover:text-text-primary disabled:opacity-40")}
          >
            <Icon name="chevron_right" className="text-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
