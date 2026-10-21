"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { SteamIcon } from "@/components/ui/steam-icon";
import { seedTestInventoryAction, syncSteamInventory } from "../actions/inventory";
import type { SteamSync } from "../types";
import { SteamConnectModal } from "./steam-connect-modal";
import { SteamTutorialModal } from "./steam-tutorial-modal";

/** What the inventory rail says when there's nothing in it to list — and why. */
export function InventoryEmpty({ steam }: { steam: SteamSync }) {
  const notLinked = !steam.linked;
  const privateInventory = steam.status === "private";
  const rateLimited = steam.status === "rate-limited";
  const [pending, startTransition] = useTransition();

  const handleLoadDemo = () => {
    startTransition(async () => {
      try {
        const res = await seedTestInventoryAction();
        if (res.ok) {
          toast.success("Test backpack loaded!", {
            description: `Loaded ${res.count} tradable skins valued at $${res.totalValueUsd.toLocaleString()}.`,
          });
        }
      } catch {
        toast.error("Could not load test items.");
      }
    });
  };

  const handleSyncAgain = () => {
    startTransition(async () => {
      try {
        const res = await syncSteamInventory();
        if (res.status === "ok") {
          toast.success(`Synced ${res.itemCount} items from Steam!`);
        } else {
          toast.error(`Steam sync: ${res.status}`);
        }
      } catch {
        toast.error("Sync failed.");
      }
    });
  };

  if (notLinked) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-subtle bg-surface-container-lowest px-space-md py-space-lg text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-tertiary/30 bg-tertiary/10 text-tertiary">
          <SteamIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-headline-sm text-sm font-semibold text-text-primary">
            No Steam Account Linked Yet
          </span>
          <span className="max-w-sm font-body-sm text-xs text-text-secondary">
            Connect your Steam account to import and liquidate your CS2, Dota 2, and TF2 inventory with zero bot latency.
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <SteamConnectModal
            steam={steam}
            trigger={
              <Button
                variant="default"
                size="sm"
                className="h-auto gap-2 rounded-lg bg-primary px-4 py-2 font-headline-sm text-xs font-bold tracking-wider text-white uppercase shadow-md hover:bg-primary/90"
              >
                <Icon name="sports_esports" className="text-[16px]" />
                <span>Link Steam Account</span>
              </Button>
            }
          />
          <LinkButton
            href="/api/auth/steam/sign-in?callbackURL=/sell"
            variant="outline"
            size="sm"
            className="h-auto gap-2 rounded-lg border-white/10 px-4 py-2 font-headline-sm text-xs font-bold tracking-wider uppercase hover:border-white/20"
          >
            <SteamIcon className="h-4 w-4" />
            <span>OpenID Sign-In</span>
          </LinkButton>
          <SteamTutorialModal />
          <LinkButton
            href="/user/kyc"
            variant="default"
            size="sm"
            className="h-auto gap-1.5 rounded-lg bg-primary px-3 py-2 font-headline-sm text-xs font-bold tracking-wider text-white uppercase shadow-md hover:bg-primary/90"
          >
            <Icon name="verified_user" className="text-[15px]" />
            <span>شروع احراز هویت</span>
          </LinkButton>
          <Button
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={handleLoadDemo}
            className="h-auto gap-1.5 rounded-lg border-tertiary/40 bg-tertiary/20 px-3 py-2 font-headline-sm text-xs font-bold tracking-wider text-tertiary uppercase hover:bg-tertiary/30"
          >
            <Icon name="flash_on" className="text-[16px]" />
            <span>Load Demo Backpack</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-subtle bg-surface-container-lowest px-space-md py-space-lg text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-surface-card text-text-muted">
        <Icon name={privateInventory ? "lock" : rateLimited ? "timer" : "inventory_2"} className="text-[26px]" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-headline-sm text-sm font-semibold text-text-primary">
          {privateInventory
            ? "اینونتوری استیم شما خصوصی (Private) است"
            : rateLimited
              ? "Steam rate limit active"
              : "Nothing here to list for this game"}
        </span>
        <span className="max-w-sm font-body-sm text-xs text-text-secondary">
          {privateInventory
            ? "برای نمایش و قیمت‌گذاری آیتم‌ها، در تنظیمات حریم خصوصی استیم گزینه Inventory را روی Public قرار دهید."
            : rateLimited
              ? "Valve is rate-limiting inventory pulls right now. You can retry shortly or test with demo items."
              : "Only marketable items appear. You can sync again or load demo items for immediate testing."}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        {privateInventory && <SteamTutorialModal />}
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={handleSyncAgain}
          className="h-auto gap-1.5 rounded-lg border-white/10 px-3 py-2 font-headline-sm text-xs font-bold tracking-wider uppercase hover:border-white/20"
        >
          <Icon name="sync" className="text-[15px]" />
          <span>Sync Now</span>
        </Button>
        <LinkButton
          href="/user/kyc"
          variant="default"
          size="sm"
          className="h-auto gap-1.5 rounded-lg bg-primary px-3 py-2 font-headline-sm text-xs font-bold tracking-wider text-white uppercase shadow-md hover:bg-primary/90"
        >
          <Icon name="verified_user" className="text-[15px]" />
          <span>شروع احراز هویت</span>
        </LinkButton>
        <Button
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={handleLoadDemo}
          className="h-auto gap-1.5 rounded-lg border-tertiary/40 bg-tertiary/20 px-3 py-2 font-headline-sm text-xs font-bold tracking-wider text-tertiary uppercase hover:bg-tertiary/30"
        >
          <Icon name="flash_on" className="text-[15px]" />
          <span>Load Demo Items</span>
        </Button>
      </div>
    </div>
  );
}
