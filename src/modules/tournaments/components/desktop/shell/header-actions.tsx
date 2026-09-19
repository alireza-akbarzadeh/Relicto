import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import type { ArenaUser } from "../../../shell.types";

export function HeaderSearch({ placeholder }: { placeholder: string }) {
  return (
    <label className="hidden w-48 items-center rounded bg-surface-container-lowest px-space-md py-space-xs md:flex xl:w-64">
      <Icon name="search" className="mr-space-sm text-body-md text-text-muted" />
      <input
        type="text"
        enterKeyHint="search"
        aria-label="Search"
        placeholder={placeholder}
        className="w-full border-none bg-transparent font-body-sm text-body-sm text-text-primary outline-hidden placeholder:text-text-muted focus:ring-0"
      />
    </label>
  );
}

export function NotificationButton({ unread }: { unread: boolean }) {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative rounded bg-surface-container-low p-space-sm text-text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
    >
      <Icon name="notifications" className="text-body-lg" />
      {unread && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-live" />}
    </button>
  );
}

export function UserChip({ user }: { user: ArenaUser }) {
  return (
    <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-low/80 py-1.5 pr-space-md pl-space-sm">
      <div className="relative shrink-0">
        <Image
          src={user.avatar}
          alt={`${user.handle} avatar`}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-status-upcoming">
          <span className="h-1.5 w-1.5 rounded-full bg-canvas-base" />
        </span>
      </div>
      <div className="hidden flex-col text-left sm:flex">
        <div className="flex items-center gap-space-xs">
          <span className="font-label-caps text-label-caps leading-tight text-text-primary uppercase">
            {user.handle}
          </span>
          <span className="rounded bg-tertiary-container/30 px-1.5 font-label-badge text-label-badge text-tertiary">
            {user.rank}
          </span>
        </div>
        <span className="font-data-mono-md text-[10px] leading-tight text-text-muted">{user.status}</span>
      </div>
    </div>
  );
}
