"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GridPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  pageSizeOptions?: readonly number[];
}

export function GridPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: GridPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border-subtle/50 text-xs font-mono">
      {/* Range Display & Page Size */}
      <div className="flex items-center gap-3 text-text-muted">
        <span>
          Showing <strong className="text-text-primary">{startItem}–{endItem}</strong> of{" "}
          <strong className="text-text-primary">{totalItems}</strong> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] text-text-muted">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="h-7 bg-surface-container border border-border-subtle rounded px-1.5 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 self-end sm:self-auto">
        <Button
          size="xs"
          variant="outline"
          disabled={safePage <= 1}
          onClick={() => onPageChange(1)}
          className="size-7 p-0 bg-surface-container border-border-subtle"
          title="First Page"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        <Button
          size="xs"
          variant="outline"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="size-7 p-0 bg-surface-container border-border-subtle"
          title="Previous Page"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        <div className="flex items-center gap-1 px-1.5 text-xs text-text-muted">
          <span>Page</span>
          <strong className="text-text-primary">{safePage}</strong>
          <span>of</span>
          <strong className="text-text-primary">{totalPages}</strong>
        </div>

        <Button
          size="xs"
          variant="outline"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="size-7 p-0 bg-surface-container border-border-subtle"
          title="Next Page"
        >
          <ChevronRight className="size-3.5" />
        </Button>

        <Button
          size="xs"
          variant="outline"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="size-7 p-0 bg-surface-container border-border-subtle"
          title="Last Page"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
