"use client";

import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { formatMoney } from "@/lib/format";
import { useSession } from "@/modules/relicto/state/session-provider";
import type { ProfileMobile } from "../../mobile.types";

const ACTION = "h-auto w-full gap-1.5 rounded-lg border-0 px-3 py-2.5 whitespace-normal font-headline-sm text-[13px] font-bold tracking-wider text-text-primary uppercase transition-all active:scale-[0.98]";

/** Instant (session wallet) and escrow-held balances with deposit / cashout. */
export function VaultBalance({ escrow }: { escrow: ProfileMobile["escrow"] }) {
  const { user } = useSession();

  return (
    <div className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-tertiary-container/15 blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="account_balance_wallet" className="text-[18px] text-tertiary" />
          <span className="font-headline-sm text-[15px] tracking-tight text-text-primary uppercase">Vault Escrow Balance</span>
        </div>
        <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-badge text-label-badge text-text-secondary uppercase">USD ASSETS</span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm">
        <div className="flex flex-col rounded-lg bg-surface-container-lowest p-space-sm">
          <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Instant Available</span>
          <span className="mt-1 font-data-mono-lg text-data-mono-lg font-bold tracking-tight text-tertiary">{formatMoney(user.walletUsd)}</span>
          <span className="mt-0.5 font-body-sm text-[11px] text-text-muted">Ready for dispatch</span>
        </div>
        <div className="flex flex-col rounded-lg bg-surface-container-lowest p-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Escrow Held</span>
            <Icon name="lock_clock" label="Locked during active trade sessions" className="text-[13px] text-status-upcoming" />
          </div>
          <span className="mt-1 font-data-mono-lg text-data-mono-lg font-bold tracking-tight text-text-primary">{formatMoney(escrow.heldUsd)}</span>
          <span className="mt-0.5 font-body-sm text-[11px] text-status-upcoming">{escrow.pending}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-space-sm">
        <LinkButton href="/wallet#deposit" className={`${ACTION} bg-primary-container shadow-md hover:bg-on-primary`}>
          <Icon name="add_circle" className="text-[16px]" />
          Deposit Funds
        </LinkButton>
        <LinkButton href="/wallet#cashout" className={`${ACTION} bg-surface-container-highest shadow-xs hover:bg-surface-bright`}>
          <Icon name="payments" className="text-[16px]" />
          Cashout / Payout
        </LinkButton>
      </div>
    </div>
  );
}
