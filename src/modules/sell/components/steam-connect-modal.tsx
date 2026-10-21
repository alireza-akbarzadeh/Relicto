"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SteamIcon } from "@/components/ui/steam-icon";
import { linkSteamAccountAction, seedTestInventoryAction } from "../actions/inventory";
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
  const t = useTranslations("steamModal");
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [inputVal, setInputVal] = useState("");
  const [pending, startTransition] = useTransition();

  const handleLink = () => {
    if (!inputVal.trim()) {
      toast.error(t("errorEmptyInput"));
      return;
    }
    startTransition(async () => {
      try {
        const res = await linkSteamAccountAction(inputVal.trim());
        if (!res.ok) {
          toast.error(res.error ?? t("errorLinkFailed"));
          return;
        }
        if (res.sync?.status === "ok") {
          toast.success(t("successSynced", { count: res.sync.itemCount }));
        } else if (res.sync?.status === "private") {
          toast.warning(t("warningPrivate"), {
            description: t("warningPrivateDesc"),
          });
        } else if (res.sync?.status === "rate-limited") {
          toast.info(t("infoRateLimited"));
        } else {
          toast.success(t("successConnected"));
        }
        setOpen(false);
      } catch {
        toast.error(t("errorGeneric"));
      }
    });
  };

  const handleLoadTest = () => {
    startTransition(async () => {
      try {
        const res = await seedTestInventoryAction();
        if (res.ok) {
          toast.success(t("successDemo"), {
            description: t("successDemoDesc", {
              count: res.count,
              value: res.totalValueUsd.toLocaleString(),
            }),
          });
          setOpen(false);
        }
      } catch {
        toast.error(t("errorDemo"));
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
              {t("title")}
            </DialogTitle>
          </div>
          <DialogDescription className="font-body-sm text-xs text-text-secondary">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          {steam?.linked && (
            <div className="flex items-center justify-between rounded-lg border border-status-live/30 bg-status-live/10 px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-status-live animate-pulse" />
                <span className="font-semibold text-text-primary">{t("accountLinked")}</span>
              </div>
              <span className="font-data-mono-md text-[11px] text-text-muted">
                {steam.itemCount} {t("syncedText", { status: steam.synced ?? "Synced" })}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-lg border border-white/[0.08] bg-surface-container-lowest p-3">
            <label htmlFor="steam-id-input" className="font-label-caps text-[10px] font-bold tracking-wider text-text-muted uppercase">
              {t("inputLabel")}
            </label>
            <div className="flex gap-2">
              <Input
                id="steam-id-input"
                placeholder={t("inputPlaceholder")}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="h-9 border-white/10 bg-surface-container-low font-data-mono-md text-xs text-text-primary placeholder:text-text-muted"
              />
              <Button
                variant="default"
                size="sm"
                disabled={pending}
                onClick={handleLink}
                className="h-9 shrink-0 bg-primary px-3 font-headline-sm text-xs font-bold uppercase text-white hover:bg-primary/90"
              >
                {pending ? <Icon name="sync" className="animate-spin text-sm" /> : t("linkBtn")}
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/[0.06]" />
            <span className="absolute bg-surface-card px-2 font-label-badge text-[10px] text-text-muted uppercase">{t("or")}</span>
          </div>

          <Link
            href="/api/auth/steam/sign-in?callbackURL=/sell"
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-container-low font-headline-sm text-xs font-bold text-text-primary uppercase transition hover:border-white/20 hover:bg-surface-container-high"
          >
            <SteamIcon className="h-4 w-4" />
            <span>{t("openIdBtn")}</span>
          </Link>

          <div className="rounded-lg border border-tertiary/20 bg-tertiary/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-tertiary uppercase">{t("quickDemoTitle")}</span>
                <span className="font-body-sm text-[11px] text-text-secondary">{t("quickDemoDesc")}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={pending}
                onClick={handleLoadTest}
                className="h-8 shrink-0 border-tertiary/40 bg-tertiary/20 font-headline-sm text-[11px] font-bold text-tertiary uppercase hover:bg-tertiary/30"
              >
                {t("quickDemoBtn")}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px]">
            <a
              href="https://steamcommunity.com/my/edit/settings"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-tertiary hover:underline"
            >
              <span>{t("steamPrivacyGuide")}</span>
              <Icon name="open_in_new" className="text-[11px]" />
            </a>
            <Link
              href="/user/kyc"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
            >
              <Icon name="verified_user" className="text-[12px]" />
              <span>{t("startKyc")}</span>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
