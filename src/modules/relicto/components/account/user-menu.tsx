"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/hooks/use-theme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { authClient } from "@/lib/auth-client";
import { formatMoney } from "@/lib/format";
import { ACCOUNT_LINKS } from "../../data/navigation";
import { useSession, useViewer } from "../../state/session-provider";
import { useTranslations } from "next-intl";
import { AvatarImage } from "./avatar-image";
import { GuestActions } from "./guest-actions";
import { USER_TRIGGERS } from "./user-triggers";

type UserMenuProps = { trigger: keyof typeof USER_TRIGGERS };

/** Account dropdown: profile, level, balance, quick links, and sign-out. */
function UserMenuInnerContent({ onClose }: { onClose?: () => void }) {
  const { user } = useSession();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const t = useTranslations("shell");

  const signOut = async () => {
    await authClient.signOut();
    toast.success(t("signedOutToast"), { description: t("signedOutDesc") });
    router.push("/sign-in");
    router.refresh();
  };

  const getLinkLabel = (href: string, fallback: string) => {
    switch (href) {
      case "/dashboard": return t("dashboard");
      case "/profile": return t("traderProfile");
      case "/orders": return t("ordersEscrow");
      case "/wallet": return t("walletIncome");
      case "/sell": return t("sellItems");
      case "/verify": return t("securitySteamGuard");
      default: return fallback;
    }
  };

  return (
    <div className="flex flex-col gap-1.5 p-2">
      {/* User Card Header */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/50 p-3.5 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <span className="flex h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/10 border border-white/5">
              <AvatarImage user={user} size={44} />
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-menu-panel bg-status-live" title={t("online")} />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="truncate font-headline-sm text-base font-extrabold tracking-tight text-text-primary">
              {user.handle}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                {t("level", { level: user.level })}
              </span>
              <span className="font-label-badge text-[10px] font-semibold text-text-muted uppercase tracking-wider truncate">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Balance Strip */}
        <div className="mt-3.5 flex items-center justify-between rounded-xl bg-surface-container-high/30 px-3 py-2 border border-white/[0.04]">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-caps text-[9px] font-bold uppercase tracking-widest text-text-muted">
              {t("steamWallet")}
            </span>
            <span className="font-data-mono-md text-sm font-bold text-amber-400">
              {formatMoney(user.walletUsd)}
            </span>
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
      </div>

      {/* Navigation Section */}
      <div className="mt-1.5 px-1">
        <span className="block px-2 py-2 font-label-caps text-[10px] font-bold uppercase tracking-widest text-text-muted">
          {t("accountManagement")}
        </span>
        {ACCOUNT_LINKS.filter((link) => (link.href === "/dashboard" ? user.role?.toLowerCase() === "admin" : true)).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`group flex items-center justify-between rounded-lg px-2.5 py-2.5 text-xs font-medium transition-all hover:bg-white/5 active:scale-[0.98] ${
              link.href === "/dashboard"
                ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                name={link.icon}
                className={`text-[18px] transition-colors duration-150 ${
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

      <div className="px-1">
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => { toggle(); onClose?.(); }}
          className="group flex w-full items-center gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2.5 text-xs font-medium text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary active:scale-[0.98]"
        >
          <Icon name={theme === "light" ? "dark_mode" : "light_mode"} className="text-[18px] text-text-muted group-hover:text-amber-400" />
          <span>{theme === "light" ? t("darkMode") : t("lightMode")}</span>
        </Button>
      </div>

      <hr className="my-1.5 border-white/5" />

      {/* Sign Out Action */}
      <div className="px-1 pb-2">
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => { signOut(); onClose?.(); }}
          className="group flex w-full items-center gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2.5 text-xs font-semibold text-status-offline transition-all hover:bg-status-offline/10 hover:text-status-offline active:scale-[0.98]"
        >
          <Icon name="logout" className="text-[18px] text-status-offline transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>{t("signOut")}</span>
        </Button>
      </div>
    </div>
  );
}

/** The avatar menu for a signed-in trader; sign-in and create-account for a guest. */
export function UserMenu({ trigger }: UserMenuProps) {
  return useViewer() ? <SignedInUserMenu trigger={trigger} /> : <GuestActions />;
}

function SignedInUserMenu({ trigger }: UserMenuProps) {
  const { user } = useSession();
  const Trigger = USER_TRIGGERS[trigger];
  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderTrigger = (props: React.ComponentPropsWithoutRef<"button">) => (
    <Button
      {...props}
      type="button"
      variant={null}
      size={null}
      aria-label="Account menu"
      className="group rounded-xl border-0 bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-tertiary/50 transition-transform active:scale-95"
    >
      <Trigger user={user} />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer showSwipeHandle>
        <DrawerTrigger render={renderTrigger} />
        <DrawerContent className="bg-menu-panel border-t border-white/10 p-2"><UserMenuInnerContent /></DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={renderTrigger} />
      <DropdownMenuContent align="end" className="w-80 border border-white/10 bg-menu-panel/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden p-0">
        <UserMenuInnerContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}