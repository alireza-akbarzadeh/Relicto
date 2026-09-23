"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { placeOrder } from "../actions/cart";

export type DispatchChoice = { rail: string; promo: boolean };

/** What the buyer is told when the server declines to settle. */
const DECLINED = {
  "rail-unavailable": ["That rail isn't live yet", "Settle from your Relicto vault balance for now."],
  "insufficient-funds": ["Not enough in your vault", "Top up from the wallet, or remove an item from the basket."],
  stale: ["Your basket changed", "Review the updated basket, then authorize again."],
  empty: ["Your basket is empty", "Add an item from the marketplace first."],
} as const;

const decline = (status: keyof typeof DECLINED) =>
  toast.error(DECLINED[status][0], { description: DECLINED[status][1] });

/**
 * Authorize & Dispatch: settles the basket, then hands the new escrow codes to
 * the dispatch dialog — or to `onPlaced`, for screens that go straight on.
 */
export function useCheckoutDispatch({ onPlaced }: { onPlaced?: (codes: string[]) => void } = {}) {
  const router = useRouter();
  const { items, sync } = useCart();
  const [codes, setCodes] = useState<string[] | null>(null);
  const [pending, startTransition] = useTransition();

  const dispatch = ({ rail, promo }: DispatchChoice) => {
    if (items.length === 0) {
      decline("empty");
      return;
    }

    startTransition(async () => {
      try {
        const result = await placeOrder({ rail, promo, cartIds: items.map((item) => item.id) });
        if (result.items) sync(result.items);
        if (result.status === "placed") (onPlaced ?? setCodes)(result.codes);
        else decline(result.status);
      } catch {
        toast.error("Couldn't authorize the trade", { description: "Check your connection and try again." });
      }
    });
  };

  return {
    dispatch,
    pending,
    codes,
    close: () => setCodes(null),
    /** The first escrow's live tracker; the rest are on the orders ledger. */
    monitor: () => codes && router.push(`/orders/${codes[0]}`),
  };
}
