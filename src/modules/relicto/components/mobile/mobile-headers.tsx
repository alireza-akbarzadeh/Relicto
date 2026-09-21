import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { MobileWallet } from "./mobile-wallet";

/** Mobile top bars, one per Stitch header family. Wallet, alerts and avatar come from the session. */

/** Marketplace and price tracker. */
export function MarketMobileHeader() {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-deep/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-space-sm px-space-md">
        <div className="flex items-center gap-space-sm">
          <Link href="/marketplace" className="flex items-center gap-space-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-card shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <Icon name="token" className="text-[20px] text-primary" />
            </span>
            <span className="font-headline-sm text-headline-sm tracking-wider text-text-primary uppercase">Relicto</span>
          </Link>
          <span className="flex items-center gap-1.5 rounded-full bg-surface-container-low px-2 py-0.5 shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live shadow-[0_0_6px_var(--color-status-live)]" />
            <span className="font-label-badge text-label-badge tracking-widest text-text-secondary uppercase">Steam</span>
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <MobileWallet variant="market" />
          <NotificationsMenu trigger="mobile" />
          <UserMenu trigger="mobile" />
        </div>
      </div>
    </header>
  );
}

/** Game hub, sell studio, wallet and price alerts. */
export function LinkedMobileHeader() {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-dim/80 shadow-[0_1px_8px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-space-sm px-margin">
        <Link href="/" className="flex min-w-0 items-center gap-space-sm">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container shadow-[inset_0_0_12px_rgba(244,63,94,0.15)]">
            <Icon name="token" className="text-[20px] text-primary-container" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-headline-sm text-headline-sm leading-none tracking-tight text-text-primary">RELICTO</span>
            <span className="flex items-center gap-1.5 pt-0.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-label-badge text-label-badge text-text-secondary uppercase">Steam Linked</span>
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-space-sm">
          <MobileWallet variant="linked" />
          <NotificationsMenu trigger="mobileLinked" />
          <UserMenu trigger="mobileLinked" />
        </div>
      </div>
    </header>
  );
}

/** Order tracking and trader profile. */
export function IntelMobileHeader() {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-deep/85 shadow-[0_1px_8px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-space-md">
        <Link href="/" className="flex items-center gap-space-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-surface-container font-headline-sm font-bold tracking-tighter text-primary">
            RL
          </span>
          <span className="flex flex-col">
            <span className="flex items-center gap-1">
              <span className="font-headline-sm text-headline-sm tracking-tight text-primary-container uppercase">Relicto</span>
              <span className="flex items-center gap-1 rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-label-badge text-status-upcoming">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-upcoming" />
                SYNC
              </span>
            </span>
            <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">INTEL EXCHANGE</span>
          </span>
        </Link>
        <div className="flex items-center gap-space-sm">
          <MobileWallet variant="intel" />
          <UserMenu trigger="mobilePlain" />
        </div>
      </div>
    </header>
  );
}
