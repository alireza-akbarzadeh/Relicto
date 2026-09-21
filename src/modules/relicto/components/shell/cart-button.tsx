"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";
import { useCart } from "../../state/cart-provider";

export function CartButton() {
  const router = useRouter();
  const { items, count, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  const handleExecuteTrade = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setOpen(false);
      router.push("/checkout");
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <Button
        variant={null}
        size={null}
        onClickCapture={() => setOpen(true)}
        aria-label={`Open basket with ${count} items`}
        className="group relative flex h-10 items-center justify-center rounded-xl border border-white/10 bg-surface-container-low/80 px-3 transition-all duration-200 hover:border-tertiary/40 hover:bg-surface-container-high active:scale-95 backdrop-blur-md"
      >
        <div className="relative flex items-center justify-center text-text-secondary transition-colors group-hover:text-tertiary">
          <Icon name="shopping_bag" className="text-[20px]" />
        </div>

        {count > 0 && (
          <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-tertiary px-1.5 font-data-mono-md text-[10px] font-bold text-on-tertiary shadow-[0_0_10px_rgba(245,158,11,0.4)]">
            {count}
          </span>
        )}
      </Button>

      {/* Sheet Side Drawer */}
      <SheetContent className="flex w-full flex-col border-l border-white/10 bg-surface-card/95 p-0 backdrop-blur-xl shadow-2xl sm:max-w-md">
        {/* Sheet Header */}
        <SheetHeader className="border-b border-white/5 bg-surface-container-low/50 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary border border-tertiary/20">
                <Icon name="shopping_bag" className="text-[20px]" />
              </div>
              <div className="flex items-center gap-2">
                <SheetTitle className="font-headline-sm text-base font-bold tracking-tight text-text-primary uppercase">
                  Trade Basket
                </SheetTitle>
                <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-data-mono-md text-xs font-semibold text-tertiary border border-white/10">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            {count > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1 rounded-md border border-white/10 bg-surface-container-low px-2.5 py-1 font-label-badge text-xs font-medium text-text-muted hover:border-status-offline/50 hover:text-status-offline transition-all active:scale-95"
              >
                <Icon name="delete_sweep" className="text-[16px]" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          <SheetDescription className="text-xs text-text-muted mt-1">
            Reserved items ready for instant Steam escrow delivery.
          </SheetDescription>
        </SheetHeader>

        {/* Speed & Trust Telemetry Strip */}
        <div className="grid grid-cols-2 gap-2 border-b border-white/5 bg-surface-container-lowest/50 p-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-surface-container-low/60 px-2.5 py-1.5">
            <Icon name="verified" className="text-[18px] text-emerald-400" />
            <div>
              <div className="font-headline-sm text-[11px] font-bold text-text-primary leading-tight">
                0-Day Hold Verified
              </div>
              <div className="font-data-mono-md text-[10px] text-text-muted">
                Instant peer escrow
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-surface-container-low/60 px-2.5 py-1.5">
            <Icon name="bolt" className="text-[18px] text-tertiary" />
            <div>
              <div className="font-headline-sm text-[11px] font-bold text-text-primary leading-tight">
                ~12s Bot Dispatch
              </div>
              <div className="flex items-center gap-1 font-data-mono-md text-[10px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Cart Items Container */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 [scrollbar-width:thin]">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-surface-container-low/50 text-text-muted">
                <Icon name="cancel" className="text-[36px] opacity-60" />
              </div>
              <div className="flex flex-col gap-1 max-w-[220px]">
                <span className="font-headline-sm text-sm font-bold text-text-primary">
                  Your trade basket is empty
                </span>
                <span className="text-xs text-text-muted">
                  Browse verified Counter-Strike 2 & Dota 2 skins to start instant settlement.
                </span>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col gap-2.5 rounded-xl border border-white/5 bg-surface-container-low/60 p-3 transition-all hover:border-white/10 hover:bg-surface-container-high/60"
              >
                <div className="flex items-start gap-3">
                  {/* Item Image */}
                  <div
                    onClick={() => {
                      setOpen(false);
                      router.push(`/items/${item.id}`);
                    }}
                    className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-surface-container-lowest"
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.name}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.wear && (
                      <span className="absolute bottom-1 left-1 rounded border border-tertiary/30 bg-black/80 px-1 py-0.5 font-data-mono-md text-[9px] font-bold text-tertiary uppercase tracking-tight">
                        {item.wear}
                      </span>
                    )}
                  </div>

                  {/* Item Metadata */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-data-mono-md text-[10px] font-bold uppercase tracking-wider text-tertiary truncate">
                          {item.category || "★ Covert Item"}
                        </span>
                        <button
                          aria-label="Remove item"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item.id);
                          }}
                          className="rounded p-0.5 text-text-muted hover:bg-white/5 hover:text-status-offline transition-colors"
                        >
                          <Icon name="close" className="text-[16px]" />
                        </button>
                      </div>

                      <h3
                        onClick={() => {
                          setOpen(false);
                          router.push(`/items/${item.id}`);
                        }}
                        className="cursor-pointer font-headline-sm text-sm font-bold text-text-primary leading-snug truncate mt-0.5 hover:text-tertiary transition-colors"
                      >
                        {item.name}
                      </h3>
                      {item.subname && (
                        <div className="text-xs font-medium text-text-secondary truncate">
                          {item.subname}
                        </div>
                      )}
                    </div>

                    {/* Item Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {item.floatValue !== undefined && (
                        <span className="rounded border border-white/5 bg-surface-container-lowest px-1.5 py-0.5 font-data-mono-md text-[10px] text-text-muted">
                          Float: <span className="font-semibold text-tertiary">{item.floatValue}</span>
                        </span>
                      )}
                      {item.paintSeed && (
                        <span className="rounded border border-white/5 bg-surface-container-lowest px-1.5 py-0.5 font-data-mono-md text-[10px] text-text-muted">
                          #{item.paintSeed}
                        </span>
                      )}
                      <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-emerald-400">
                        0-HOLD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Ribbon */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-data-mono-md text-base font-bold text-text-primary">
                      {formatMoney(item.price)}
                    </span>
                    {item.discountPercentage && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-emerald-400">
                        -{item.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 rounded border border-tertiary/20 bg-tertiary/10 px-2 py-0.5 font-data-mono-md text-[10px] text-tertiary">
                    <Icon name="lock" className="text-[12px]" />
                    <span>ESCROW READY</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Financial Escrow Breakdown Card */}
          {count > 0 && (
            <div className="mt-1 space-y-2 rounded-xl border border-white/5 bg-surface-container-lowest p-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5 font-data-mono-md text-[10px] font-bold uppercase tracking-wider text-text-muted">
                <span>Settlement Breakdown</span>
                <span className="text-emerald-400">VERIFIED ESCROW</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Items Subtotal</span>
                <span className="font-data-mono-md font-bold text-text-primary">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-text-secondary">
                  Platform Trading Fee
                  <Icon name="info" className="text-[13px] text-text-muted" />
                </span>
                <span className="font-data-mono-md font-semibold text-emerald-400">
                  $0.00 (0% PROMO)
                </span>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                <span className="font-headline-sm text-xs font-bold text-text-primary uppercase tracking-wider">
                  Total Settlement
                </span>
                <span className="font-data-mono-md text-lg font-bold text-tertiary">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        {count > 0 && (
          <SheetFooter className="border-t border-white/10 bg-surface-container-low/80 p-4 backdrop-blur-md">
            <div className="w-full space-y-2">
              <Button
                onClick={handleExecuteTrade}
                disabled={isExecuting}
                className="w-full h-12 justify-between rounded-xl bg-gradient-to-r from-tertiary to-amber-600 px-4 font-headline-sm text-sm font-bold uppercase tracking-wide text-on-tertiary shadow-lg shadow-tertiary/20 hover:from-amber-500 hover:to-amber-700 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    name={isExecuting ? "sync" : "lock"}
                    className={`text-[18px] ${isExecuting ? "animate-spin" : ""}`}
                  />
                  <span className="text-xs">
                    {isExecuting
                      ? "Dispatching Bot Offer..."
                      : "Lock Escrow & Execute Trade"}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-data-mono-md text-sm">
                  <span>{formatMoney(subtotal)}</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </div>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-center pt-0.5">
                <Icon name="verified_user" className="text-[13px] text-text-muted" />
                <p className="text-[10px] font-medium text-text-muted">
                  Protected by Valve OpenID 2.0 & Multisig Escrow
                </p>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}