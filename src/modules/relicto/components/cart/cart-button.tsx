"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";
import { quote } from "@/modules/checkout/lib/pricing";
import { useCart } from "../../state/cart-provider";
import { CartAssurances } from "./cart-assurances";
import { CartEmpty } from "./cart-empty";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

/**
 * The header basket and its drawer. Every line here is already reserved in
 * Postgres, so the drawer only reviews and removes — settling happens on
 * `/checkout`, which is where the rails and the vault balance live.
 */
export function CartButton() {
  const router = useRouter();
  const { items, count, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  const pricesUsd = items.map((item) => item.price);
  const due = quote(
    pricesUsd.map((price) => Math.round(price * 100)),
    true,
  ).dueCents;

  const close = () => setOpen(false);
  const goToCheckout = () => {
    close();
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant={null}
        size={null}
        onClickCapture={() => setOpen(true)}
        aria-label={`Open basket with ${count} ${count === 1 ? "item" : "items"}`}
        className="group relative flex h-10 items-center justify-center rounded-xl border border-border-subtle bg-surface-container-low px-3 backdrop-blur-md transition-all duration-200 hover:border-border-tactical hover:bg-surface-container-high active:scale-95"
      >
        <span className="relative flex items-center justify-center text-text-secondary transition-colors group-hover:text-tertiary">
          <Icon name="shopping_bag" className="text-[20px]" />
        </span>
        {count > 0 && (
          <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-tertiary px-1.5 font-data-mono-md text-[10px] font-bold text-on-tertiary">
            {count}
          </span>
        )}
      </Button>

      <SheetContent className="flex w-full flex-col border-l border-border-subtle bg-surface-card p-0 backdrop-blur-xl sm:max-w-md">
        <SheetHeader className="border-b border-border-subtle bg-surface-container-low px-5 py-4">
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-tactical bg-surface-container text-tertiary">
                <Icon name="shopping_bag" className="text-[20px]" />
              </span>
              <div className="flex min-w-0 items-center gap-2">
                <SheetTitle className="truncate font-headline-sm text-base font-bold tracking-tight text-text-primary uppercase">
                  Trade Basket
                </SheetTitle>
                <span className="shrink-0 rounded-full border border-border-subtle bg-surface-container-high px-2 py-0.5 font-data-mono-md text-xs font-semibold text-tertiary">
                  {count}
                </span>
              </div>
            </div>

            {count > 0 && (
              <Button
                variant={null}
                size={null}
                onClick={clearCart}
                className="h-auto shrink-0 gap-1 rounded-md border border-border-subtle bg-surface-container-low px-2.5 py-1 font-label-badge text-xs font-medium text-text-muted transition-all hover:border-primary hover:text-primary active:scale-95"
              >
                <Icon name="delete_sweep" className="text-[16px]" />
                <span>Clear</span>
              </Button>
            )}
          </div>
          <SheetDescription className="mt-1 font-body-sm text-xs text-text-muted">
            Reserved items ready for instant Steam escrow delivery.
          </SheetDescription>
        </SheetHeader>

        <CartAssurances />

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 [scrollbar-width:thin]">
          {items.length === 0 ? (
            <CartEmpty onNavigate={close} />
          ) : (
            <>
              {items.map((item) => (
                <CartLine key={item.id} item={item} onRemove={removeItem} onNavigate={close} />
              ))}
              <CartSummary pricesUsd={pricesUsd} />
            </>
          )}
        </div>

        {count > 0 && (
          <SheetFooter className="border-t border-border-subtle bg-surface-container-low p-4 backdrop-blur-md">
            <div className="w-full space-y-2">
              <Button
                onClick={goToCheckout}
                className="h-12 w-full justify-between rounded-xl bg-tertiary px-4 font-headline-sm text-sm font-bold tracking-wide text-on-tertiary uppercase transition-all hover:bg-tertiary-fixed active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <Icon name="lock" className="text-[18px]" />
                  <span className="text-xs">Review &amp; settle escrow</span>
                </span>
                <span className="flex items-center gap-1 font-data-mono-md text-sm">
                  <span>{formatMoney(due / 100)}</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </span>
              </Button>
              <p className="flex items-center justify-center gap-1.5 pt-0.5 text-center font-body-sm text-[10px] font-medium text-text-muted">
                <Icon name="verified_user" className="text-[13px]" />
                Protected by Valve OpenID 2.0 &amp; multisig escrow
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
