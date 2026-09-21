"use client";

import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { AvatarImage } from "@/modules/relicto/components/account/avatar-image";
import { useSession } from "@/modules/relicto/state/session-provider";
import type { ProfileMobile } from "../../mobile.types";

/** Trader header: session portrait, level, verified handle, tier chips and the Steam sync strip. */
export function IdentityCard({ profile }: { profile: ProfileMobile }) {
  const { user } = useSession();

  return (
    <div className="relative flex flex-col gap-space-sm overflow-hidden rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-secondary-container/20 blur-2xl" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-surface-container-high shadow-md">
              <AvatarImage user={user} size={64} />
            </div>
            <div className="absolute -right-1 -bottom-2 flex items-center gap-0.5 rounded bg-surface-container-lowest px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-tertiary shadow-md">
              <span className="text-[9px] text-text-muted">LVL</span>
              {user.level}
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="truncate font-headline-sm text-headline-sm text-text-primary">@{user.handle}</h1>
              {user.verified && <Icon name="verified" filled label="Verified trader" className="text-[18px] text-primary-container" />}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="rounded bg-primary-container/20 px-2 py-0.5 font-label-badge text-label-badge font-bold tracking-wider text-primary-container uppercase">
                {profile.role}
              </span>
              <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-badge text-label-badge text-secondary uppercase">{profile.tier}</span>
            </div>
          </div>
        </div>
        <NoticeButton
          aria-label="Profile display settings"
          notice={{ title: "Profile display", description: "Showcase order and privacy controls arrive with account settings." }}
          className="h-9 w-9 rounded-lg border-0 bg-surface-container-low text-text-muted transition-colors hover:bg-surface-container-high hover:text-text-primary"
        >
          <Icon name="tune" className="text-[20px]" />
        </NoticeButton>
      </div>

      <div className="mt-1 flex items-center justify-between rounded-lg bg-surface-container-lowest/60 px-3 pt-space-xs pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-upcoming opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-upcoming" />
          </span>
          <span className="font-label-badge text-label-badge tracking-wide text-text-primary uppercase">
            {user.steamSynced ? "Steam Synced" : "Steam Offline"}
          </span>
        </div>
        <div className="flex items-center gap-1 font-data-mono-md text-data-mono-md text-text-muted">
          <Icon name="bolt" className="text-[14px] text-status-upcoming" />
          <span>{profile.ping}</span>
          <span className="px-1 text-surface-container-highest">•</span>
          <span className="text-[11px] text-text-muted">{profile.botId}</span>
        </div>
      </div>
    </div>
  );
}
