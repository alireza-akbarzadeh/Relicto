"use client";

import { useState } from "react";
import type { CashoutRow } from "../mobile.types";

/** Bulk liquidation picks and the derived gross value. */
export function useBulkCashout(rows: CashoutRow[]) {
  const [selected, setSelected] = useState(() => new Set(rows.filter((row) => row.selected).map((row) => row.id)));

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return {
    isSelected: (id: string) => selected.has(id),
    // Rows can leave the tray under the picks (a trade-up burns them), so count what's still shown.
    count: rows.filter((row) => selected.has(row.id)).length,
    totalUsd: rows.reduce((sum, row) => sum + (selected.has(row.id) ? row.priceUsd : 0), 0),
    toggle,
  };
}
