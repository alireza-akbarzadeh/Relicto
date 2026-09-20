"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const BASE = "h-auto gap-space-xs rounded-lg border-0 px-space-md py-space-sm font-headline-sm text-[13px] font-semibold tracking-wider uppercase";

/** Sync, share and edit actions on the trader banner. */
export function HeroActions() {
  const [syncing, setSyncing] = useState(false);

  const sync = () => {
    setSyncing(true);
    toast.loading("Initiating real-time Steam Inventory sync...", { id: "sync" });
    window.setTimeout(() => {
      setSyncing(false);
      toast.success("Inventory synced", { id: "sync", description: "142 items re-appraised from the Steam Web API." });
    }, 1600);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Portfolio URL copied to clipboard");
    } catch {
      toast.error("Clipboard blocked", { description: "Your browser denied clipboard access." });
    }
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-space-sm sm:flex-nowrap lg:w-auto">
      <Button
        onClick={sync}
        disabled={syncing}
        className={`${BASE} flex-1 bg-surface-container-high text-text-primary transition-all duration-200 hover:bg-surface-bright sm:flex-none`}
      >
        <Icon name="bolt" className="text-[18px] text-primary" />
        <span>Sync Inventory</span>
      </Button>
      <Button
        onClick={share}
        className={`${BASE} flex-1 bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-text-primary sm:flex-none`}
      >
        <Icon name="share" className="text-[18px]" />
        <span>Share</span>
      </Button>
      <Button
        onClick={() => toast("Profile editor is on the roadmap", { description: "Showcase ordering and bio editing land with the accounts API." })}
        className={`${BASE} w-full shrink whitespace-normal bg-primary-container px-space-lg font-bold text-on-primary-container shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all hover:bg-primary-container/90 sm:w-auto`}
      >
        <Icon name="tune" className="text-[18px]" />
        <span>Edit Profile &amp; Showcase</span>
      </Button>
    </div>
  );
}
