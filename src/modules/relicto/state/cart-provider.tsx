"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCartState } from "@/modules/relicto/hooks/use-cart-state";
import type { CheckoutItem } from "@/modules/checkout/types";

type CartState = ReturnType<typeof useCartState>;

const CartContext = createContext<CartState | null>(null);

/** Shares the live basket across the signed-in app; `initialItems` comes from the server render. */
export function CartProvider({
  initialItems,
  children,
}: {
  initialItems: CheckoutItem[];
  children: ReactNode;
}) {
  const value = useCartState(initialItems);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>.");
  return cart;
}
