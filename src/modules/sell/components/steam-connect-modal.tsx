"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SteamIcon } from "@/components/ui/steam-icon";
import { cn } from "@/lib/cn";
import { linkSteamAccountAction, seedTestInventoryAction, syncSteamInventory } from "../actions/inventory";
import type { SteamSync } from "../types";

export function SteamConnectModal({
  steam,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  steam?: SteamSync;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [inputVal, setInputVal] = useState("");
  const [pending, startTransition] = useTransition();

  const handleLink = () => {
    if (!inputVal.trim()) {
      toast.error("Please enter a SteamID64 or Trade URL");
      return;
    }
    startTransition(async () => {
      try {
        const res = await linkSteamAccountAction(inputVal.trim());
        if (!res.ok) {
          toast.error(res.error ?? "Failed to link Steam account");
          return;
        }
        if (res.sync?.status === "ok") {
          toast.success(`Connected! Synced ${res.sync.itemCount} items from Steam.`);
        } else if (res.sync?.status === "private") {
          toast.warning("Steam linked, but your Steam inventory is Private.", {
            description: "Set inventory to Public in Steam Privacy Settings to view items.",
          });
        } else if (res.sync?.status === "rate-limited") {
          toast.info("Steam linked! Valve is rate-limiting sync; retry in a minute.");
        } else {
          toast.success("Steam account connected successfully.");
        }
        setOpen(false);
      } catch {
        toast.error("Failed to connect Steam account. Try again.");
      }
    });
  };

  const handleLoadTest = () => {
    startTransition(async () => {
      try {
        const res = await seedTestInventoryAction();
        if (res.ok) {
          toast.success("Test backpack loaded!", {
            description: `Loaded ${res.count} tradable skins valued at $${res.totalValueUsd.toLocaleString()}.`,
          });
          setOpen(false);
        }
      } catch {
        toast.error("Could not load test items.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={<div>{trigger}</div>} />
      ) : (
        <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold uppercase" />}>
          <SteamIcon className="h-4 w-4" />
          <span>Steam Sync</span>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md border-white/10 bg-surface-card p-6 text-text-primary shadow-2xl">
        <DialogHeader className="gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tertiary/20 text-tertiary">
              <SteamIcon className="h-5 w-5" />
            </div>
            <DialogTitle className="font-headline-md text-base font-bold uppercase">
              Steam Inventory Sync
            </DialogTitle>
          </div>
          <DialogDescription className="font-body-sm text-xs text-text-secondary">
            Connect your Steam account to import tradable CS2, Dota 2, and TF2 skins with live market floor pricing.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-lg border border-white/[0.08] bg-surface-container-lowest p-3">
            <label htmlFor="steam-id-input" className="font-label-caps text-[10px] font-bold tracking-wider text-text-muted uppercase">
              Enter SteamID64 or Steam Trade URL
            </label>
            <div className="flex gap-2">
              <Input
                id="steam-id-input"
                placeholder="76561198... or https://steamcommunity.com/..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="h-9 border-white/10 bg-surface-container-low font-data-mono-md text-xs text-text-primary placeholder:text-text-muted"
              />
              <Button
                variant="primary"
                size="sm"
                disabled={pending}
                onClick={handleLink}
                className="h-9 shrink-0 px-3 font-headline-sm text-xs font-bold uppercase"
              >
                {pending ? <Icon name="sync" className="animate-spin text-sm" /> : "Link"}
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/[0.06]" />
            <span className="absolute bg-surface-card px-2 font-label-badge text-[10px] text-text-muted uppercase">OR</span>
          </div>

          <Link
            href="/api/auth/steam/sign-in?callbackURL=/sell"
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-container-low font-headline-sm text-xs font-bold text-text-primary uppercase transition hover:border-white/20 hover:bg-surface-container-high"
          >
            <SteamIcon className="h-4 w-4" />
            <span>Connect Via Steam OpenID</span>
          </Link>

          <div className="rounded-lg border border-tertiary/20 bg-tertiary/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-tertiary uppercase">Quick Test Backpack</span>
                <span className="font-body-sm text-[11px] text-text-secondary">Load 12 sample CS2 & Dota 2 skins to test selling immediately.</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={pending}
                onClick={handleLoadTest}
                className="h-8 shrink-0 border-tertiary/40 bg-tertiary/20 font-headline-sm text-[11px] font-bold text-tertiary uppercase hover:bg-tertiary/30"
              >
                Load Demo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
