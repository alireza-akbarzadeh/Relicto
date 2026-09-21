"use client";

import { useQueryState } from "nuqs";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { cartTotals, railSearchParam } from "../lib/mobile";
import type { CheckoutMobile } from "../mobile.types";

/** Cart lines, the selected rail (`?rail=`) and every derived amount the mobile checkout shows. */
export function useMobileCheckout(data: CheckoutMobile) {
  const { items, removeItem } = useCart();
  const [railId, setRail] = useQueryState("rail", railSearchParam.withOptions({ history: "replace", clearOnDefault: true }));
  const rail = data.rails.find((entry) => entry.id === railId) ?? data.rails[0];
  const totals = cartTotals(items, rail);

  return {
    items,
    removeItem,
    rail,
    setRail: (id: typeof railId) => void setRail(id),
    ...totals,
    remainingUsd: data.vaultUsd - totals.total,
    eth: totals.total / data.ethUsd,
  };
}
