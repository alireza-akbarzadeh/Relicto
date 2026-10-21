"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useSteamSync } from "../hooks/use-steam-sync";
import type { SteamSync } from "../types";
import { SteamConnectModal } from "./steam-connect-modal";

/**
 * "Steam Sync: 4m ago" in the inventory rail's header, with manual sync trigger
 * and quick modal to connect Steam or load test items.
 */
export function SteamSyncStatus({ steam }: { steam: SteamSync }) {
  const t = useTranslations("inventoryList");
  const { pending, sync } = useSteamSync();
  const problem = steam.status && steam.status !== "ok";

  const getStatusText = () => {
    if (pending) return t("syncing");
    if (steam.status === "private") return t("private");
    if (steam.status === "rate-limited") return t("rateLimited");
    if (steam.status === "unavailable") return t("unavailable");
    return steam.synced ?? t("never");
  };

  const text = getStatusText();

  if (!steam.linked) {
    return (
      <SteamConnectModal
        steam={steam}
        trigger={
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 font-data-mono-md text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            <span>{t("steamSyncLabel")}</span>
            <span className="rounded border border-tertiary/40 bg-tertiary/15 px-1.5 py-0.5 font-headline-sm text-[10px] font-bold tracking-wider text-tertiary uppercase hover:brightness-110">
              {t("linkSteam")}
            </span>
          </button>
        }
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={null}
        size={null}
        onClick={sync}
        disabled={pending}
        aria-label={t("syncAria")}
        className="h-auto gap-1 rounded-none border-0 p-0 font-data-mono-md text-xs font-normal text-text-secondary hover:text-text-primary"
      >
        {t("steamSyncLabel")} <span className={cn(problem ? "text-error" : "text-tertiary")}>{text}</span>
        <Icon name="sync" className={cn("text-[14px] text-status-upcoming", pending && "animate-spin")} />
      </Button>

      <SteamConnectModal
        steam={steam}
        trigger={
          <button
            type="button"
            title={t("settingsTitle")}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-text-muted hover:bg-white/5 hover:text-text-primary"
          >
            <Icon name="settings" className="text-[13px]" />
          </button>
        }
      />
    </div>
  );
}
