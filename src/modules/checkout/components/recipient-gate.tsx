"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { isValidTradeUrl } from "@/lib/steam/trade-url";
import { saveSteamTradeUrl } from "@/modules/profile/actions/steam";
import type { CheckoutRecipient } from "../types";

export function RecipientGate({
  recipient,
}: {
  recipient?: CheckoutRecipient;
}) {
  const t = useTranslations("checkout");
  const handle = recipient?.handle ?? "S1mple_CS";
  const initials = handle.slice(0, 2).toUpperCase();
  const level = recipient?.level ?? 94;
  const tier = recipient?.tier ?? "Prime Tier";
  const steamId = recipient?.steamId ?? "76561198082348819";
  const initialUrl =
    recipient?.tradeUrl ??
    "https://steamcommunity.com/tradeoffer/new/?partner=122068591&token=K98xA40f";

  const [tradeUrl, setTradeUrl] = useState(initialUrl);
  const [editing, setEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();

  const valid = isValidTradeUrl(tradeUrl);

  const handleSave = () => {
    if (!valid) {
      toast.error(t("invalidTradeUrl"), {
        description: t("invalidTradeUrlDesc"),
      });
      return;
    }
    startSaving(async () => {
      const res = await saveSteamTradeUrl(tradeUrl);
      if (res.success) {
        toast.success(t("destinationUpdated"), {
          description: t("destinationUpdatedDesc"),
        });
        setEditing(false);
      } else {
        toast.error(t("updateFailed"), { description: res.error });
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-surface-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/6 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-upcoming/15 text-status-upcoming">
            <Icon name="verified_user" className="text-[16px]" />
          </div>
          <div>
            <h2 className="font-headline-sm text-sm font-bold text-text-primary">
              {t("destinationTitle")}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-status-upcoming/10 px-2.5 py-0.5 font-data-mono-md text-[11px] font-semibold text-status-upcoming">
            <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />
            {t("readyForPush")}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing((prev) => !prev)}
            className="h-auto rounded-lg px-2.5 py-1 text-xs text-text-muted transition-colors hover:bg-surface-container-high hover:text-text-primary"
          >
            {editing ? t("cancelBtn") : t("changeBtn")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-high font-headline-sm text-sm font-bold text-primary shadow-inner">
            {initials}
            <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-upcoming shadow-xs">
              <Icon
                name="check"
                className="text-[10px] text-surface-container-lowest"
              />
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-headline-sm text-sm font-bold text-text-primary">
                {handle}
              </span>
              <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-data-mono-md text-[10px] text-status-upcoming">
                LVL {level}
              </span>
              <span className="rounded bg-tertiary-container/30 px-1.5 py-0.5 font-data-mono-md text-[10px] text-tertiary">
                {tier}
              </span>
            </div>
            <span className="font-data-mono-md text-xs pt-2 text-text-muted">
              SteamID64: {steamId}
            </span>
          </div>
        </div>

        {editing ? (
          <div className="flex min-w-0 flex-1 max-w-lg items-center gap-2">
            <Input
              value={tradeUrl}
              onChange={(e) => setTradeUrl(e.target.value)}
              placeholder={t("tradeUrlPlaceholder")}
              className="h-9 rounded-lg border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary"
            />
            <Button
              type="button"
              size="sm"
              disabled={isSaving || !valid}
              onClick={handleSave}
              className="h-9 shrink-0 rounded-lg bg-status-upcoming/20 px-3 text-xs font-bold text-status-upcoming hover:bg-status-upcoming/30"
            >
              {isSaving ? t("savingBtn") : t("saveBtn")}
            </Button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 max-w-md items-center justify-between rounded-xl border border-white/6 bg-surface-container-lowest px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Icon name="key" className="text-[15px] text-text-muted shrink-0" />
              <span className="truncate font-data-mono-md text-xs text-text-secondary">
                {tradeUrl}
              </span>
            </div>
            <span className="ml-2 shrink-0 rounded bg-status-upcoming/15 px-2 py-0.5 font-data-mono-md text-[10px] font-medium text-status-upcoming">
              {t("verifiedSpeed", { ms: 12 })}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-surface-container-low px-2.5 py-1 text-text-muted">
          <Icon
            name="phonelink_ring"
            className="text-[14px] text-status-upcoming"
          />
          {t("mobile2fa")}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-surface-container-low px-2.5 py-1 text-text-muted">
          <Icon name="bolt" className="text-[14px] text-status-upcoming" />
          {t("noHold")}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-surface-container-low px-2.5 py-1 text-text-muted">
          <Icon name="shield" className="text-[14px] text-status-upcoming" />
          {t("antiHijack")}
        </span>
      </div>
    </section>
  );
}
