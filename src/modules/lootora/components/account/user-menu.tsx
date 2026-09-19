"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { ACCOUNT_LINKS } from "../../data/navigation";
import { useSession } from "../../state/session-provider";
import { USER_TRIGGERS } from "./user-triggers";

type UserMenuProps = { trigger: keyof typeof USER_TRIGGERS };

/** Account dropdown: the header's avatar block opens profile, ledger, wallet and sign-out. */
export function UserMenu({ trigger }: UserMenuProps) {
  const { user } = useSession();
  const router = useRouter();
  const Trigger = USER_TRIGGERS[trigger];

  const signOut = () => {
    toast.success("Signed out", { description: "Your Steam session was closed on this device." });
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account menu" className="rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-border-focus">
        <Trigger user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-2.5 py-2">
          <div className="flex flex-col">
            <span className="font-headline-sm text-[14px] font-bold text-text-primary">{user.handle}</span>
            <span className="font-label-badge text-[10px] text-text-muted uppercase">LVL {user.level} · {user.role}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">Wallet</span>
            <span className="font-data-mono-md text-[13px] font-bold text-tertiary">{formatMoney(user.walletUsd)}</span>
          </div>
        </div>
        <DropdownMenuLabel className="mt-1">Account</DropdownMenuLabel>
        {ACCOUNT_LINKS.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>
              <Icon name={link.icon} className="text-[18px] text-text-muted" />
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut} className="text-primary data-[highlighted]:text-primary">
          <Icon name="login" className="rotate-180 text-[18px]" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
