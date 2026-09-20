"use client";

import { formatMoney } from "@/lib/format";
import { MARKET_NAV } from "../../data/navigation";
import { useSession } from "../../state/session-provider";
import { AvatarImage } from "../account/avatar-image";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { VaultBrand } from "./brand";
import { VaultHeaderSearch } from "./header-search";
import { NavLinks } from "./nav-link";
import { CartButton } from "./cart-button";

/** Header of the item vault (detail) screens: Steam identity chip, cart and avatar. */
export function VaultHeader({ steamId }: { steamId: string }) {
  const { user } = useSession();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-border-subtle bg-overlay-base/95 shadow-[0_4px_24px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex shrink-0 items-center gap-6">
          <VaultBrand />
          <nav className="hidden items-center gap-1 rounded-lg border border-border-subtle bg-surface-container-lowest/90 p-1 xl:flex">
            <NavLinks items={MARKET_NAV} variant="vault" />
          </nav>
        </div>
        <VaultHeaderSearch />
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-data-mono-md text-xs font-medium text-text-primary">{steamId}</span>
                <span className="rounded border border-emerald-500/30 bg-emerald-950/70 px-1 font-label-badge text-[9px] font-bold text-emerald-400">
                  VAC CLEAN
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="font-label-badge text-[10px] text-text-muted uppercase">Steam Wallet:</span>
                <span className="font-data-mono-md text-xs font-bold text-tertiary">{formatMoney(user.walletUsd)}</span>
              </div>
            </div>
          </div>
          <NotificationsMenu trigger="vault" />
          <CartButton />
          <UserMenu trigger="vault" />
        </div>
      </div>
    </header>
  );
}
