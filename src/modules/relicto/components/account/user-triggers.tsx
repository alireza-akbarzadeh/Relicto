import { Icon } from "@/components/ui/icon";
import { AvatarImage } from "./avatar-image";
import type { SessionUser } from "../../session-types";

/** Account triggers, one per header family, transcribed from the Stitch headers. */

export function MarketUserTrigger({ user }: { user: SessionUser }) {
  return (
    <span className="flex items-center gap-space-sm pl-space-xs text-left">
      <span className="relative">
        <span className="flex h-8 w-8 overflow-hidden rounded-full bg-primary">
          <AvatarImage user={user} size={32} />
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
        <span className="flex h-8 w-8 overflow-hidden rounded-full bg-primary">
          <AvatarImage user={user} size={32} />
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
    <div className="flex h-10 items-center gap-2.5 rounded-xl border border-white/10 bg-surface-container-low/80 p-1.5 pr-3 text-left backdrop-blur-md transition-all duration-200 hover:border-tertiary/40 hover:bg-surface-container-high active:scale-95">
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-surface-container-lowest">
        <AvatarImage user={user} size={28} />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-headline-sm text-xs font-bold leading-none text-text-primary">
            {user.handle}
          </span>
          <span className="rounded bg-tertiary/10 px-1 py-0.5 font-data-mono-md text-[9px] font-bold text-tertiary border border-tertiary/20 leading-none uppercase">
            LVL {user.level}
          </span>
        </div>
        <span className="font-label-caps text-[9px] font-semibold uppercase tracking-wider text-text-muted leading-none truncate">
          {user.role}
        </span>
      </div>
    </div>
  );
}

export function HubUserTrigger({ user }: { user: SessionUser }) {
  return (
    <span className="flex items-center gap-2.5 rounded-md border border-border-dark bg-surface-card p-1.5 pr-3 text-left">
      <span className="relative">
        <span className="flex h-8 w-8 overflow-hidden rounded bg-linear-to-tr/srgb from-rose-600 to-indigo-600">
          <AvatarImage user={user} size={32} />
        </span>
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-status-live ring-2 ring-surface-card" />
      </span>
      <span className="flex flex-col">
        <span className="flex items-center gap-1.5">
          <span className="text-xs leading-none font-bold text-white">{user.handle}</span>
          <span className="rounded border border-indigo-700/40 bg-indigo-900/60 px-1 font-mono text-[9px] text-secondary">LVL {user.level}</span>
        </span>
        <span className="mt-1 flex items-center gap-2">
          <span className="font-mono text-[9px] font-semibold tracking-wider text-tertiary uppercase">{user.role}</span>
          {user.steamSynced && (
            <span className="flex items-center gap-1 font-mono text-[9px] text-status-upcoming uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />
              Synced
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

export function VaultUserTrigger({ user }: { user: SessionUser }) {
  return (
    <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-tactical bg-surface-container-high shadow-[0_0_10px_rgba(244,63,94,0.3)]">
      <AvatarImage user={user} size={36} />
    </span>
  );
}

/** Mobile headers: a bare 32px portrait. Each family casts a different glow. */
function MobilePortrait({ user, glow }: { user: SessionUser; glow?: string }) {
  return (
    <span className={`flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary ${glow ?? ""}`}>
      <AvatarImage user={user} size={32} />
    </span>
  );
}

export function MobileUserTrigger({ user }: { user: SessionUser }) {
  return <MobilePortrait user={user} glow="shadow-[0_0_10px_rgba(244,63,94,0.35)]" />;
}

export function MobileLinkedUserTrigger({ user }: { user: SessionUser }) {
  return <MobilePortrait user={user} glow="shadow-[0_0_12px_rgba(255,178,183,0.3)]" />;
}

export function MobilePlainUserTrigger({ user }: { user: SessionUser }) {
  return <MobilePortrait user={user} />;
}

export const USER_TRIGGERS = {
  market: MarketUserTrigger,
  ledger: LedgerUserTrigger,
  studio: StudioUserTrigger,
  hub: HubUserTrigger,
  vault: VaultUserTrigger,
  mobile: MobileUserTrigger,
  mobileLinked: MobileLinkedUserTrigger,
  mobilePlain: MobilePlainUserTrigger,
} as const;
