"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { UserMenu } from "@/modules/relicto/components/account/user-menu";
import { MobileBackButton } from "@/modules/relicto/components/mobile/mobile-back-button";
import { useCart } from "@/modules/relicto/state/cart-provider";

/** Checkout top bar: back, escrow-lock brand, multi-sig chip, basket count and account. */
export function CheckoutMobileHeader() {
  const { count } = useCart();

  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-space-sm px-gutter">
        <div className="flex items-center gap-space-sm">
          <MobileBackButton fallback="/marketplace" className="rounded bg-surface-container-low/60 text-on-surface hover:text-primary active:scale-95" />
          <div className="flex items-center gap-space-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <Icon name="shield_with_heart" className="text-[18px] text-on-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps leading-none tracking-widest text-text-primary uppercase">Relicto</span>
              <span className="mt-1 flex items-center gap-1 font-label-badge text-label-badge leading-none font-bold tracking-tight text-tertiary uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
                Escrow Lock
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <div className="flex items-center gap-1.5 rounded bg-surface-container-high/80 px-space-sm py-1">
            <Icon name="lock_clock" className="text-[16px] text-status-upcoming" />
            <span className="font-label-badge text-label-badge text-status-upcoming uppercase">Multi-Sig</span>
          </div>
          <Link
            href="/marketplace"
            aria-label={`Basket, ${count} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded bg-surface-container-low/60 text-on-surface transition-colors hover:text-primary"
          >
            <Icon name="shopping_bag" className="text-[20px]" />
            {count > 0 && (
              <span className="absolute top-2 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded bg-primary px-1 font-label-badge text-label-badge leading-none font-bold text-on-primary shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                {count}
              </span>
            )}
          </Link>
          <UserMenu trigger="mobilePlain" />
        </div>
      </div>
    </header>
  );
}
