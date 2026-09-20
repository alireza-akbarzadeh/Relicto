"use client"

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatMoney } from "@/lib/format";
import { useSession } from "../../state/session-provider";

export function WalletChip() {
  const { user } = useSession();
  const balance = formatMoney(user.walletUsd);

  return (
      <Tooltip>
        <div className="flex items-center gap-1 rounded-full bg-surface-container-low/80 p-1 border border-white/5 backdrop-blur-md">
          <TooltipTrigger>
            <Link
              href="/wallet"
              className="group flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors hover:bg-surface-container-high"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-tertiary/10 text-tertiary transition-transform group-hover:scale-110">
                <Icon name="account_balance_wallet" className="text-[14px]" />
              </div>
              <span className="font-data-mono-md text-xs font-semibold tracking-tight text-text-primary">
                {balance}
              </span>
            </Link>
          </TooltipTrigger>
          <div className="h-3 w-px bg-white/10" />

          <Link
            href="/wallet#deposit"
            aria-label="Deposit funds"
            className="group flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container transition-all hover:bg-tertiary hover:text-on-tertiary hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]"
          >
            <Icon
              name="add"
              className="text-[14px] transition-transform group-hover:rotate-90"
            />
          </Link>
        </div>

        <TooltipContent
          side="bottom"
          align="end"
          className="w-56 border-white/10 bg-surface-card/95 p-3 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-label-badge text-[10px] text-text-muted uppercase">
                Steam Wallet
              </span>
              <span className="flex items-center gap-1 rounded-full bg-status-live/10 px-1.5 py-0.5 font-label-badge text-[9px] text-status-live">
                <span className="h-1.5 w-1.5 rounded-full bg-status-live animate-pulse" />
                Synced
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-text-secondary">Available</span>
              <b className="font-data-mono-md text-sm text-tertiary font-bold">
                {balance}
              </b>
            </div>

            <Link
              href="/wallet#deposit"
              className="mt-1 flex items-center justify-center gap-1.5 rounded bg-primary-container py-1.5 font-label-caps text-[10px] text-on-primary-container uppercase transition-opacity hover:opacity-90"
            >
              <Icon name="add_circle" className="text-[14px]" />
              Top-Up Funds
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
  );
}