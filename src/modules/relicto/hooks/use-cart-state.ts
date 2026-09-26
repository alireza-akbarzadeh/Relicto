"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart, clearCart, removeFromCart } from "@/modules/checkout/actions/cart";
import type { CheckoutItem } from "@/modules/checkout/types";

const failed = (title: string) => toast.error(title, { description: "Check your connection and try again." });

/**
 * The basket, optimistic on the client and reconciled with whatever the
 * server answers. `saved` lines are reserved in Postgres; `local` lines have no
 * listing behind them yet (mobile compositions still on mocks) and live only
 * in this tab until those screens are wired.
 */
export function useCartState(initialItems: CheckoutItem[]) {
  const [saved, setSaved] = useState(initialItems);
  const [local, setLocal] = useState<CheckoutItem[]>([]);
  const items = useMemo(() => [...saved, ...local], [saved, local]);

  /** Matches a cart row id, a listing id or an item slug. */
  const has = useCallback(
    (ref: string) => items.some((item) => item.id === ref || item.listingId === ref || item.slug === ref),
    [items],
  );

  const dropLocal = (id: string) => setLocal((current) => current.filter((item) => item.id !== id));

  /**
   * `ref` names what to reserve: a listing id, or a slug for its cheapest copy.
   * Resolves true once the server holds the line, so a caller heading straight
   * to checkout can wait for it instead of racing the reservation.
   */
  const addItem = (item: CheckoutItem, ref = item.id): Promise<boolean> => {
    if (has(ref) || has(item.id)) return Promise.resolve(false);
    setLocal((current) => [...current, item]);

    return addToCart({ ref })
      .then((result) => {
        if (result.status === "not-listed" || !result.items) return false;
        dropLocal(item.id);
        setSaved(result.items);
        if (result.status === "own-listing") {
          toast.error(`${item.name} is your own listing`, { description: "Manage it from the seller studio instead." });
          return false;
        }
        return true;
      })
      .catch(() => {
        dropLocal(item.id);
        failed(`Couldn't reserve ${item.name}`);
        return false;
      });
  };

  const removeItem = (id: string) => {
    if (local.some((item) => item.id === id)) return dropLocal(id);

    const before = saved;
    setSaved((current) => current.filter((item) => item.id !== id));
    removeFromCart({ cartId: id })
      .then((lines) => lines && setSaved(lines))
      .catch(() => {
        setSaved(before);
        failed("Couldn't update your basket");
      });
  };

  const clear = () => {
    const before = { saved, local };
    setSaved([]);
    setLocal([]);
    clearCart()
      .then((lines) => lines && setSaved(lines))
      .catch(() => {
        setSaved(before.saved);
        setLocal(before.local);
        failed("Couldn't clear your basket");
      });
  };

  return { items, count: items.length, has, addItem, removeItem, clearCart: clear, sync: setSaved };
}
