"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useSteamSync } from "../hooks/use-steam-sync";
import type { SteamSync } from "../types";

const LABEL: Record<NonNullable<SteamSync["status"]>, string> = {
  ok: "",
  private: "Inventory private",
  "rate-limited": "Steam busy",
  unavailable: "Steam unreachable",
};

/**
 * "Steam Sync: 4m ago" in the inventory rail's header, and the button that
 * pulls again. The sample studio keeps the design's static line.
 */
export function SteamSyncStatus({ steam }: { steam: SteamSync }) {
  const { pending, sync } = useSteamSync();
  const problem = steam.status && steam.status !== "ok";
  const text = pending ? "syncing…" : problem ? LABEL[steam.status!] : (steam.synced ?? "never");

  if (!steam.linked) {
    return (
      <Link
        href="/api/auth/steam/sign-in?callbackURL=/sell"
        className="flex items-center gap-1.5 font-data-mono-md text-xs text-text-secondary transition-colors hover:text-text-primary"
      >
        <span>Steam Sync:</span>
        <span className="rounded border border-tertiary/40 bg-tertiary/15 px-1.5 py-0.5 font-headline-sm text-[10px] font-bold tracking-wider text-tertiary uppercase hover:brightness-110">
          Link Steam
        </span>
      </Link>
    );
  }

  return (
    <Button
      variant={null}
      size={null}
      onClick={sync}
      disabled={pending}
      aria-label="Sync Steam inventory now"
      className="h-auto gap-1 rounded-none border-0 p-0 font-data-mono-md text-xs font-normal text-text-secondary hover:text-text-primary"
    >
      Steam Sync: <span className={cn(problem ? "text-error" : "text-tertiary")}>{text}</span>
      <Icon name="sync" className={cn("text-[14px] text-status-upcoming", pending && "animate-spin")} />
    </Button>
  );
}
