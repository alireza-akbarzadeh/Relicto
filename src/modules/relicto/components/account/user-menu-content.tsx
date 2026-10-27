"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/language-toggle";
import { useTheme } from "@/hooks/use-theme";
import { authClient } from "@/lib/auth-client";
import { formatMoney, toPersianDigits } from "@/lib/format";
import { ACCOUNT_LINKS } from "../../data/navigation";
import { useSession } from "../../state/session-provider";
import { AvatarImage } from "./avatar-image";

/** Account dropdown: profile, level, balance, quick links, region/lang and sign-out. */
export function UserMenuInnerContent({ onClose }: { onClose?: () => void }) {
  const { user, unreadCount } = useSession();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const t = useTranslations("shell");
  const locale = useLocale();

  const getRole = (r: string) => {
    const k = r?.toLowerCase();
    return k === "admin" ? t("roleAdmin") : k === "vendor" ? t("roleVendor") : k === "trader" ? t("roleTrader") : r;
  };

  const signOut = async () => {
    await authClient.signOut();
    toast.success(t("signedOutToast"), { description: t("signedOutDesc") });
    router.push("/sign-in");
    router.refresh();
  };

  const linkKeys: Record<string, "dashboard" | "traderProfile" | "ordersEscrow" | "walletIncome" | "sellItems" | "securitySteamGuard"> = {
    "/dashboard": "dashboard",
    "/profile": "traderProfile",
    "/orders": "ordersEscrow",
    "/wallet": "walletIncome",
    "/sell": "sellItems",
    "/verify": "securitySteamGuard",
  };
  const getLinkLabel = (href: string, fallback: string) => {
    const key = linkKeys[href];
    return key ? t(key) : fallback;
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 font-sans">
      {/* User Card Header */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/50 p-3.5 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <span className="flex h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/10 border border-white/5">
              <AvatarImage user={user} size={44} />
            </span>
            <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-menu-panel bg-status-live" title={t("online")} />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="truncate font-headline-sm text-base font-extrabold tracking-tight text-text-primary">
              {user.handle}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                {t("level", { level: locale === "fa" ? toPersianDigits(user.level) : user.level })}
              </span>
              <span className="font-label-badge text-[10px] font-semibold text-text-muted uppercase tracking-wider truncate">
                {getRole(user.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Balance Strip & Relicto Coins */}
        <div className="mt-3.5 flex flex-col gap-2 rounded-xl bg-surface-container-high/30 p-2.5 border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-label-caps text-[9px] font-bold uppercase tracking-widest text-text-muted">{t("steamWallet")}</span>
              <span className="font-data-mono-md text-sm font-bold text-amber-400">{formatMoney(user.walletUsd, { locale })}</span>
            </div>
            <Link
              href="/wallet#deposit"
              onClick={onClose}
              className="group flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20 transition-all hover:bg-amber-400 hover:text-black active:scale-95"
            >
              <Icon name="add" className="text-[12px] transition-transform duration-200 group-hover:rotate-90" />
              <span>{t("topUp")}</span>
            </Link>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
              <Icon name="token" className="text-[13px]" />
              <span>{(user.coins ?? 1500).toLocaleString()} RC</span>
            </div>
            <Link
              href="/chests"
              onClick={onClose}
              className="text-[10px] font-mono font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Open Chests</span>
              <Icon name="north_east" className="text-[10px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications Alert Bar (if unread) */}
      {unreadCount > 0 && (
        <Link
          href="/orders"
          onClick={onClose}
          className="flex items-center justify-between mx-1 px-2.5 py-1.5 rounded-lg bg-status-live/10 border border-status-live/20 text-xs text-status-live hover:bg-status-live/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon name="notifications" className="text-[16px]" />
            <span className="font-semibold">Unread Notifications</span>
          </div>
          <span className="rounded-full bg-status-live px-1.5 py-0.2 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        </Link>
      )}

      {/* Navigation Section */}
      <div className="mt-1 px-1">
        <span className="block px-2 py-1.5 font-label-caps text-[10px] font-bold uppercase tracking-widest text-text-muted">
          {t("accountManagement")}
        </span>
        {ACCOUNT_LINKS.filter((link) => (link.href === "/dashboard" ? user.role?.toLowerCase() === "admin" : true)).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all hover:bg-white/5 active:scale-[0.98] ${
              link.href === "/dashboard"
                ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                name={link.icon}
                className={`text-[16px] transition-colors duration-150 ${
                  link.href === "/dashboard" ? "text-primary" : "text-text-muted group-hover:text-amber-400"
                }`}
              />
              <span>{getLinkLabel(link.href, link.label)}</span>
            </div>
            {link.href === "/dashboard" && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold uppercase tracking-wider">
                ADMIN
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Region, Language & Appearance Config */}
      <div className="px-1 space-y-1 pt-1 border-t border-white/5">
        <div className="flex items-center justify-between rounded-lg px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-white/5">
          <div className="flex items-center gap-3">
            <Icon name="public" className="text-[16px] text-text-muted" />
            <span>Region & Language</span>
          </div>
          <LanguageToggle className="border-0 bg-transparent p-0 text-text-primary" />
        </div>

        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => { toggle(); onClose?.(); }}
          className="group flex w-full items-center justify-between rounded-lg border-0 bg-transparent px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <Icon name={theme === "light" ? "dark_mode" : "light_mode"} className="text-[16px] text-text-muted group-hover:text-amber-400" />
            <span>{theme === "light" ? t("darkMode") : t("lightMode")}</span>
          </div>
          <span className="font-mono text-[10px] text-text-muted uppercase">{theme}</span>
        </Button>
      </div>

      {/* Sign Out Action */}
      <div className="px-1 pt-1 border-t border-white/5">
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => { signOut(); onClose?.(); }}
          className="group flex w-full items-center gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2 text-xs font-semibold text-status-offline transition-all hover:bg-status-offline/10 hover:text-status-offline active:scale-[0.98]"
        >
          <Icon name="logout" className="text-[16px] text-status-offline transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>{t("signOut")}</span>
        </Button>
      </div>
    </div>
  );
}
