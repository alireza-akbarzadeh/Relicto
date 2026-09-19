import { Icon } from "@/components/ui/icon";
import type { SessionUser } from "../../session.types";

/** Account triggers, one per header family, transcribed from the Stitch headers. */

export function MarketUserTrigger({ user }: { user: SessionUser }) {
  return (
    <span className="flex items-center gap-space-sm pl-space-xs text-left">
      <span className="relative">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Icon name="person" className="text-[18px] text-on-primary" />
        </span>
        <span className="absolute -right-1 -bottom-1 rounded bg-secondary-container px-1 font-label-badge text-[9px] leading-tight font-bold text-on-secondary-container">
          {user.level}
        </span>
      </span>
      <span className="hidden flex-col md:flex">
        <span className="flex items-center gap-1">
          <span className="font-headline-sm text-headline-sm font-bold text-text-primary">{user.handle}</span>
          {user.verified && <Icon name="verified" className="text-[14px] text-status-upcoming" />}
        </span>
        <span className="font-label-badge text-label-badge text-text-muted">{user.role}</span>
      </span>
    </span>
  );
}

export function LedgerUserTrigger({ user }: { user: SessionUser }) {
  return (
    <span className="flex items-center gap-space-sm pl-space-xs">
      <span className="relative flex items-center justify-center rounded-full bg-primary p-0.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Icon name="person" className="text-[18px] text-on-primary" />
        </span>
      </span>
      <span className="hidden flex-col text-left md:flex">
        <span className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-[13px] leading-tight font-bold text-text-primary">{user.handle}</span>
          <span className="rounded bg-surface-container-highest px-1.5 font-label-badge text-[10px] font-bold text-status-upcoming uppercase">
            LVL {user.level}
          </span>
        </span>
        <span className="flex items-center gap-space-xs">
          <span className="font-label-badge text-[10px] font-semibold tracking-wider text-tertiary-fixed-dim uppercase">
            {user.role}
          </span>
          <span className="h-1 w-1 rounded-full bg-outline-variant" />
          <span className="font-label-badge text-[10px] text-text-muted uppercase">STEAM SYNCED</span>
        </span>
      </span>
    </span>
  );
}

export function StudioUserTrigger({ user }: { user: SessionUser }) {
  return (
    <span className="flex items-center gap-2.5 bg-surface-container-lowest py-1 pr-3 pl-2 text-left">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <Icon name="person" className="text-[18px] text-on-primary" />
      </span>
      <span className="flex flex-col">
        <span className="flex items-center gap-1.5">
          <span className="font-headline-sm text-body-sm font-semibold text-text-primary">{user.handle}</span>
          <span className="bg-surface-container-high px-1 font-data-mono-md text-label-badge text-status-upcoming">
            LVL {user.level}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-label-badge text-label-badge font-bold text-tertiary">{user.role}</span>
          <span className="inline-block h-1 w-1 rounded-full bg-status-upcoming" />
          <span className="font-label-badge text-label-badge text-text-muted uppercase">Steam Synced</span>
        </span>
      </span>
    </span>
  );
}

export const USER_TRIGGERS = {
  market: MarketUserTrigger,
  ledger: LedgerUserTrigger,
  studio: StudioUserTrigger,
} as const;
