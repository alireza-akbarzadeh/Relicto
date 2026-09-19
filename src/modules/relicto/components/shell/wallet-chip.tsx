"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { useSession } from "../../state/session-provider";

/** Steam wallet balance with a top-up shortcut, per header family. */
export function WalletChip({ variant }: { variant: "market" | "ledger" | "studio" }) {
  const { user } = useSession();
  const balance = formatMoney(user.walletUsd);

  if (variant === "ledger") {
    return (
      <Link
        href="/wallet"
        className="hidden items-center gap-space-xs rounded-lg bg-surface-container px-space-md py-space-sm sm:flex"
      >
        <span className="font-label-badge text-label-badge text-text-muted uppercase">STEAM WALLET</span>
        <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary-fixed-dim">+{balance}</span>
      </Link>
    );
  }

  if (variant === "studio") {
    return (
      <div className="flex items-center gap-3 bg-surface-container-low px-3 py-1.5">
        <div className="flex flex-col text-right">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">Steam Balance</span>
          <span className="font-data-mono-md text-data-mono-md font-bold tracking-tight text-tertiary">+{balance}</span>
        </div>
        <Link
          href="/wallet#deposit"
          className="flex items-center gap-1 bg-tertiary-container px-2.5 py-1 font-label-caps text-label-caps text-on-tertiary-container uppercase shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-all hover:bg-tertiary hover:text-on-tertiary"
        >
          <Icon name="add" className="text-[16px]" />
          <span>Deposit</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-space-xs rounded bg-surface-container-lowest px-space-sm py-1">
      <div className="flex flex-col text-right">
        <span className="font-label-badge text-label-badge text-text-muted uppercase">Steam Wallet</span>
        <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">{balance}</span>
      </div>
      <Link
        href="/wallet#deposit"
        aria-label="Top up wallet"
        className="flex items-center justify-center rounded bg-tertiary-container p-1 text-on-tertiary-container transition-colors hover:bg-tertiary hover:text-on-tertiary"
      >
        <Icon name="add" className="text-[16px]" />
      </Link>
    </div>
  );
}
