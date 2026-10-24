"use client";

import { useLocale, useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Icon } from "@/components/ui/icon";
import { toPersianDigits } from "@/lib/format";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { MarketBrand } from "./brand";
import { MarketHeaderSearch } from "./header-search";
import { MainNav } from "./main-nav";
import { WalletChip } from "./wallet-chip";
import { CartButton } from "../cart/cart-button";

/** Header of the marketplace screen. */
export function MarketHeader() {
  const t = useTranslations("shell");
  const locale = useLocale();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-surface-deep/90 shadow-[0_1px_8px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between gap-space-md px-gutter-desktop">
        <div className="flex items-center gap-space-lg">
          <MarketBrand />
          <div className="hidden h-6 w-[1px] bg-border-subtle xl:block" />
          <nav className="hidden items-center gap-space-xs xl:flex">
            <MainNav />
          </nav>
        </div>
        <MarketHeaderSearch />
        <div className="flex items-center gap-space-md">
          <div className="hidden items-center gap-space-sm 2xl:flex">
            <div className="flex items-center gap-1.5 rounded bg-surface-container-lowest px-space-sm py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-status-upcoming" />
              <span className="font-label-badge text-label-badge text-status-upcoming">{t("steamSynced")}</span>
              <span className="font-data-mono-md text-data-mono-md text-text-muted">
                {t("latencyMs", { ms: locale === "fa" ? toPersianDigits(14) : 14 })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded bg-surface-container-lowest px-space-sm py-1">
              <Icon name="verified_user" className="text-[14px] text-secondary" />
              <span className="font-label-badge text-label-badge text-secondary">{t("vacClean")}</span>
            </div>
          </div>
          <WalletChip />
          <CartButton />
          <LanguageToggle className="rounded bg-surface-container p-2 text-text-secondary hover:bg-surface-container-high hover:text-text-primary" />
          <ThemeToggle className="rounded bg-surface-container p-2 text-text-secondary hover:bg-surface-container-high hover:text-text-primary" />
          <NotificationsMenu trigger="count" />
          <UserMenu trigger="market" />
        </div>
      </div>
    </header>
  );
}
