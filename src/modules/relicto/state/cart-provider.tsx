"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CheckoutItem } from "@/modules/checkout/types";

type CartState = {
  items: CheckoutItem[];
  count: number;
  addItem: (item: CheckoutItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ initialItems, children }: { initialItems: CheckoutItem[]; children: ReactNode }) {
  const [items, setItems] = useState(initialItems);
  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem: (item: CheckoutItem) => setItems((current) => (current.some((entry) => entry.id === item.id) ? current : [...current, item])),
      removeItem: (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
      clear: () => setItems([]),
    }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>.");
  return cart;
}
