"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { triggerManualSteamSync } from "../../actions/steam";
import type { TraderIdentity } from "../../types";
import { ProfileEditModal } from "./profile-edit-modal";

const BASE = "h-auto gap-space-xs rounded-lg border-0 px-space-md py-space-sm font-headline-sm text-[13px] font-semibold tracking-wider uppercase";

/** Sync, share and edit actions on the trader banner. */
export function HeroActions({ identity }: { identity?: TraderIdentity }) {
  const [syncing, startSync] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const t = useTranslations("profile");

  const handleSync = () => {
    startSync(async () => {
      toast.loading(t("syncInitiated"), { id: "steam-sync" });
      try {
        const result = await triggerManualSteamSync();
        if (result.success) {
          toast.success(t("syncSuccess"), {
            id: "steam-sync",
            description: result.message,
          });
        } else {
          toast.error(t("syncIncomplete"), {
            id: "steam-sync",
            description: result.error,
          });
        }
      } catch {
        toast.error(t("syncFailed"), {
          id: "steam-sync",
          description: t("syncFailedDesc"),
        });
      }
    });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("sharedToast"));
    } catch {
      toast.error("Clipboard blocked", { description: t("sharedBlocked") });
    }
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-space-sm sm:flex-nowrap lg:w-auto">
        <Button
          onClick={handleSync}
          disabled={syncing}
          className={`${BASE} flex-1 bg-surface-container-high text-text-primary transition-all duration-200 hover:bg-surface-bright sm:flex-none`}
        >
          <Icon name={syncing ? "sync" : "bolt"} className={`text-[18px] text-primary ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? t("syncing") : t("syncInventory")}</span>
        </Button>
        <Button
          onClick={share}
          className={`${BASE} flex-1 bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-text-primary sm:flex-none`}
        >
          <Icon name="share" className="text-[18px]" />
          <span>{t("share")}</span>
        </Button>
        <Button
          onClick={() => setEditOpen(true)}
          className={`${BASE} w-full shrink whitespace-normal bg-primary-container px-space-lg font-bold text-on-primary-container shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all hover:bg-primary-container/90 sm:w-auto`}
        >
          <Icon name="tune" className="text-[18px]" />
          <span>{t("editProfile")}</span>
        </Button>
      </div>

      <ProfileEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={{
          handle: identity?.handle ?? "",
          realName: identity?.realName ?? "",
          alias: identity?.alias ?? "",
          role: identity?.role ?? "Trader",
          avatar: identity?.avatar ?? "",
          banner: identity?.banner ?? "",
          highlightVideo: identity?.highlightVideo ?? "",
          tradeUrl: identity?.tradeUrl ?? "",
        }}
      />
    </>
  );
}
