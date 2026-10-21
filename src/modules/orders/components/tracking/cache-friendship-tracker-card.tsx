"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CacheTradeExplainerModal } from "@/modules/marketplace/components/delivery/cache-trade-explainer-modal";

type CacheFriendshipTrackerProps = {
  itemName: string;
  sellerHandle?: string;
  placedAgo?: string;
  initialDay?: number;
  canSimulate?: boolean;
};

export function CacheFriendshipTrackerCard({
  itemName,
  sellerHandle = "Vendor",
  initialDay = 1,
  canSimulate = true,
}: CacheFriendshipTrackerProps) {
  const t = useTranslations("orderTracking");
  const [currentDay, setCurrentDay] = useState(initialDay);
  const [modalOpen, setModalOpen] = useState(false);

  const stages = [
    { day: 0, label: t("stageFriendAdded"), desc: t("stageFriendAddedDesc"), icon: "person_add" },
    { day: 15, label: t("stageEscrowActive"), desc: t("stageEscrowActiveDesc"), icon: "lock" },
    { day: 31, label: t("stageCooldownEnds"), desc: t("stageCooldownEndsDesc"), icon: "card_giftcard" },
    { day: 31, label: t("stageGiftReceived"), desc: t("stageGiftReceivedDesc"), icon: "verified" },
  ] as const;

  const progressPct = Math.min(100, Math.round((currentDay / 31) * 100));
  const daysLeft = Math.max(0, 31 - currentDay);

  const askAli = () => {
    window.dispatchEvent(
      new CustomEvent("relicto:copilot:ask", {
        detail: {
          query: t("askAliPrompt", { itemName }),
        },
      })
    );
  };

  return (
    <section className="relative flex flex-col gap-space-md overflow-hidden rounded-xl border border-pink-500/25 bg-surface-card p-space-lg shadow-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col justify-between gap-space-md sm:flex-row sm:items-start">
        <div className="flex items-start gap-space-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400 shadow-inner">
            <Icon name="card_giftcard" className="text-[26px]" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-label-badge text-label-badge tracking-wider text-pink-400 uppercase">
                {t("cacheProtocol")}
              </span>
              <span className="rounded bg-pink-500/15 px-2 py-0.5 font-data-mono-md text-[10px] font-bold text-pink-300 uppercase">
                {t("valvePolicy")}
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">
              {t("cacheHoldTitle")}
            </h2>
            <p className="max-w-xl font-body-sm text-body-sm text-text-secondary">
              {t("cacheHoldDesc", { itemName, seller: sellerHandle })}
            </p>
          </div>
        </div>

        {/* Days Left Pill */}
        <div className="flex shrink-0 flex-col items-start rounded-lg bg-surface-container-lowest px-space-md py-space-sm sm:items-end">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">{t("friendshipWindow")}</span>
          <span className="font-data-mono-lg text-data-mono-lg font-bold text-pink-400">
            {daysLeft === 0 ? t("readyToGift") : t("dayOf31", { day: currentDay, left: daysLeft })}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest/80 p-space-md border border-white/5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-muted">{t("friendshipMaturity")}</span>
          <span className="font-data-mono-md text-pink-400">{t("pctComplete", { pct: progressPct })}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* 4 Stage Pills */}
        <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4">
          {stages.map((s, idx) => {
            const isCompleted = currentDay >= s.day && (idx < 2 || currentDay >= 31);
            const isCurrent = (currentDay < 31 && idx === 1) || (currentDay >= 31 && idx >= 2);
            return (
              <div
                key={s.label}
                className={`flex flex-col gap-1 rounded-lg border p-2.5 transition-all ${
                  isCompleted
                    ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                    : isCurrent
                      ? "border-pink-500/40 bg-pink-950/20 text-pink-300"
                      : "border-white/5 bg-surface-card/40 text-text-muted"
                }`}
              >
                <div className="flex items-center gap-1.5 font-headline-sm text-xs font-semibold">
                  <Icon name={s.icon} className="text-[14px]" />
                  <span>{s.label}</span>
                </div>
                <span className="text-[10px] text-text-secondary leading-tight">{s.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-1">
        <div className="flex flex-wrap items-center gap-space-xs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 text-xs"
          >
            <Icon name="info" className="text-[14px]" />
            <span>{t("howCacheWorks")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={askAli}
            className="border-primary/40 text-primary hover:bg-primary/10 text-xs gap-1.5"
          >
            <Icon name="smart_toy" className="text-[14px]" />
            <span>{t("askAliSafe")}</span>
          </Button>
        </div>

        {canSimulate && (
          <div className="flex items-center gap-2">
            <span className="font-data-mono-md text-[10px] text-text-muted uppercase">{t("sandboxLabel")}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentDay((prev) => (prev >= 31 ? 1 : 31))}
              className="border-white/10 text-xs text-text-secondary hover:text-white"
            >
              {currentDay >= 31 ? t("resetDay1") : t("simulateDay31")}
            </Button>
          </div>
        )}
      </div>

      <CacheTradeExplainerModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
