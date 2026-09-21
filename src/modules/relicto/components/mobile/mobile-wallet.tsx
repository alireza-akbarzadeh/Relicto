"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatCount, formatMoney } from "@/lib/format";
import { useSession } from "../../state/session-provider";

type MobileWalletProps = { variant: "market" | "linked" | "intel" };

/** Session wallet balance, drawn the way each mobile header family shows it. Opens the wallet. */
export function MobileWallet({ variant }: MobileWalletProps) {
  const { user } = useSession();

  if (variant === "linked") {
    const [whole, cents] = user.walletUsd.toFixed(2).split(".");
    return (
      <Link
        href="/wallet"
        aria-label="Wallet balance"
        className="flex h-9 items-center gap-1.5 rounded-xl bg-surface-container-low px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <span className="font-label-caps text-label-caps text-tertiary">$</span>
        <span className="font-data-mono-md text-data-mono-md text-text-primary">
          {formatCount(Number(whole))}.{cents}
        </span>
      </Link>
    );
  }

  if (variant === "intel") {
    return (
      <Link href="/wallet" className="flex flex-col items-end rounded bg-surface-container-lowest px-2.5 py-1">
        <span className="font-label-badge text-label-badge text-text-muted uppercase">ESCROW BAL</span>
        <span className="font-data-mono-md text-data-mono-md font-bold tracking-tight text-tertiary">{formatMoney(user.walletUsd)}</span>
      </Link>
    );
  }

  return (
    <Link href="/wallet" className="flex items-center gap-1 rounded-lg bg-surface-card/90 px-2.5 py-1">
      <Icon name="account_balance_wallet" className="text-[14px] text-tertiary" />
      <span className="font-data-mono-md text-data-mono-md font-bold tracking-tight text-tertiary">{formatMoney(user.walletUsd)}</span>
    </Link>
  );
}
