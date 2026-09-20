"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";
import { useCart } from "../../state/cart-provider";

export function CartButton() {
  const router = useRouter();
  const { items, count, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const subtotal = items.reduce((total, item) => total + item.price, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant={null}
        size={null}
        onClickCapture={() => setOpen(true)}
        aria-label={`Open cart with ${count} items`}
        className="group relative h-auto rounded-lg border-border-subtle bg-surface-container-lowest p-2 text-on-surface-variant transition-all hover:border-tertiary hover:bg-surface-container"
      >
        <Icon name="shopping_bag" className="text-[20px] transition-colors group-hover:text-tertiary" />
        <span className="absolute -top-1 -right-1 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary-container px-1 font-label-badge text-[10px] font-bold text-on-primary-container shadow-[0_0_10px_rgba(244,63,94,0.4)]">
          {count}
        </span>
      </Button>
      <SheetContent className="w-full border-border-subtle bg-surface-deep sm:max-w-md">
        <SheetHeader className="border-b border-border-subtle px-5 py-5">
          <SheetTitle className="font-headline-lg text-headline-lg font-bold text-text-primary uppercase">Your Basket ({count})</SheetTitle>
          <SheetDescription className="font-body-sm text-body-sm text-text-secondary">Reserved items ready for secure Steam escrow checkout.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-text-muted">
              <Icon name="shopping_bag" className="text-[32px]" />
              <span className="font-headline-sm text-headline-sm text-text-primary">Your basket is empty</span>
              <span className="font-body-sm text-body-sm">Add an item from the marketplace to begin checkout.</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-surface-container-lowest">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-body-sm text-body-sm font-bold text-text-primary">{item.name}</span>
                  <span className="font-label-badge text-label-badge text-text-muted">{item.bot}</span>
                  <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">{formatMoney(item.price)}</span>
                </div>
                <Button
                  variant={null}
                  size="icon-sm"
                  onClickCapture={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from basket`}
                  className="text-text-muted hover:bg-error-container/20 hover:text-error"
                >
                  <Icon name="close" className="text-[16px]" />
                </Button>
              </div>
            ))
          )}
        </div>
        <SheetFooter className="border-t border-border-subtle bg-surface-container-lowest px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-text-muted uppercase">Basket subtotal</span>
            <span className="font-data-mono-lg text-data-mono-lg font-bold text-text-primary">{formatMoney(subtotal)}</span>
          </div>
          <Button
            disabled={items.length === 0}
            onClickCapture={() => {
              setOpen(false);
              router.push("/checkout");
            }}
            className="h-auto w-full gap-2 rounded-lg border-0 bg-primary-container py-3 font-headline-sm text-headline-sm font-bold tracking-wider text-on-primary-container uppercase hover:bg-primary"
          >
            <Icon name="lock" className="text-[18px]" />
            Go to Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
