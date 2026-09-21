"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { ACCOUNT_LINKS } from "../../data/navigation";
import { useSession } from "../../state/session-provider";
import { AvatarImage } from "./avatar-image";
import { USER_TRIGGERS } from "./user-triggers";

type UserMenuProps = { trigger: keyof typeof USER_TRIGGERS };

/** Account dropdown: profile, level, balance, quick links, and sign-out. */
export function UserMenu({ trigger }: UserMenuProps) {
  const { user } = useSession();
  const router = useRouter();
  const Trigger = USER_TRIGGERS[trigger];

  const signOut = () => {
    toast.success("Signed out", {
      description: "Your Steam session was closed on this device.",
    });
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="group rounded-xl outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 transition-transform active:scale-95"
      >
        <Trigger user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 border border-white/10 bg-surface-card/95 p-1.5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* User Card Header */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low/60 p-3 border border-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <span className="flex h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10">
                  <AvatarImage user={user} size={40} />
                </span>
                <span
                  className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-card bg-status-live"
                  title="Online"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="truncate font-headline-sm text-sm font-bold tracking-tight text-text-primary">
                  {user.handle}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-label-badge text-[9px] font-semibold text-primary border border-primary/20 uppercase">
                    LVL {user.level}
                  </span>
                  <span className="font-label-badge text-[10px] text-text-muted uppercase truncate">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Balance Strip */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-container-high/40 px-2.5 py-1.5 border border-white/[0.03]">
            <div className="flex flex-col">
              <span className="font-label-badge text-[9px] uppercase tracking-wider text-text-muted">
                Steam Wallet
              </span>
              <span className="font-data-mono-md text-xs font-bold text-tertiary">
                {formatMoney(user.walletUsd)}
              </span>
            </div>
            <Link
              href="/wallet#deposit"
              className="group flex items-center gap-1 rounded-md bg-tertiary-container/80 px-2 py-1 text-[10px] font-semibold uppercase text-on-tertiary-container transition-all hover:bg-tertiary hover:text-on-tertiary active:scale-95"
            >
              <Icon
                name="add"
                className="text-[12px] transition-transform duration-200 group-hover:rotate-90"
              />
              <span>Top-up</span>
            </Link>
          </div>
        </div>

        {/* Navigation Section */}
        <DropdownMenuGroup className="mt-1">
          <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Account Management
          </DropdownMenuLabel>
          {ACCOUNT_LINKS.map((link) => (
            <DropdownMenuItem
              key={link.href}
              render={(props) => (
                <Link
                  href={link.href}
                  {...props}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary active:scale-[0.98]"
                >
                  <Icon
                    name={link.icon}
                    className="text-[18px] text-text-muted transition-colors duration-150 group-hover:text-primary"
                  />
                  <span>{link.label}</span>
                </Link>
              )}
            />
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-white/5" />

        {/* Sign Out Action */}
        <DropdownMenuItem
          onClick={signOut}
          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-status-offline transition-all hover:bg-status-offline/10 hover:text-status-offline active:scale-[0.98]"
        >
          <Icon
            name="login"
            className="rotate-180 text-[18px] text-status-offline transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}