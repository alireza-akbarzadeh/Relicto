"use client";

import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { MARKET_NAV } from "../../data/navigation";
import { useSession } from "../../state/session-provider";
import { AvatarImage } from "../account/avatar-image";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { VaultBrand } from "./brand";
import { VaultHeaderSearch } from "./header-search";
import { NavLinks } from "./nav-link";

/** Header of the item vault (detail) screens: Steam identity chip, cart and avatar. */
export function VaultHeader({ steamId, cartCount = 2 }: { steamId: string; cartCount?: number }) {
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
          <NoticeButton
            notice={{ title: "Cart", description: "The escrow checkout drawer ships with the cart API." }}
            aria-label="Cart drawer"
            className="group h-auto gap-1.5 rounded-lg border-border-subtle bg-surface-container-lowest px-3 py-2 text-on-surface transition-all hover:border-tertiary hover:bg-surface-container"
          >
            <Icon name="shopping_bag" className="text-[20px] text-text-muted transition-colors group-hover:text-tertiary" />
            <span className="rounded-full bg-primary px-1.5 font-data-mono-md text-[11px] font-bold text-white">{cartCount}</span>
          </NoticeButton>
          <UserMenu trigger="vault" />
        </div>
      </div>
    </header>
  );
}
