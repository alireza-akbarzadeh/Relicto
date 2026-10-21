"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { SteamIcon } from "@/components/ui/steam-icon";
import { cn } from "@/lib/cn";
import type { SteamSync } from "../types";
import { SteamTutorialModal } from "./steam-tutorial-modal";

export function SellerGuideBanner({
  steam,
  tradeUrl,
  className,
}: {
  steam?: SteamSync;
  tradeUrl?: string | null;
  className?: string;
}) {
  const t = useTranslations("sellerGuide");
  const isLinked = steam?.linked ?? false;
  const isPrivate = steam?.status === "private";
  const hasTradeUrl = Boolean(tradeUrl && tradeUrl.includes("token="));

  return (
    <section className={cn("mx-auto w-full max-w-7xl px-margin-desktop pt-space-md", className)}>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-surface-card p-4 shadow-xl backdrop-blur-md sm:p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-tertiary/40 bg-tertiary/15 px-2 py-0.5 font-label-badge text-[10px] font-bold tracking-widest text-tertiary uppercase">
                {t("stepsBadge")}
              </span>
              <span className="font-data-mono-md text-[10px] text-text-muted">
                {t("kicker")}
              </span>
            </div>
            <h2 className="font-headline-md text-base font-bold text-text-primary uppercase sm:text-lg">
              {t("title")}
            </h2>
            <p className="max-w-2xl font-body-sm text-xs leading-relaxed text-text-secondary">
              {t("description")}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SteamTutorialModal />
            <Link
              href="/user/kyc"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 font-headline-sm text-xs font-bold text-white uppercase shadow-md transition-all hover:bg-primary/90 hover:shadow-primary/20"
            >
              <Icon name="verified_user" className="text-[15px]" />
              <span>{t("kycButton")}</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1: Public Inventory */}
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/15 text-tertiary">
                <SteamIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  {t("step1Title")}
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  {t("step1Desc")}
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className={isPrivate ? "font-bold text-error" : isLinked ? "font-bold text-status-live" : "text-text-muted"}>
                {isPrivate ? t("step1StatusPrivate") : isLinked ? t("step1StatusOk") : t("step1StatusUnlinked")}
              </span>
              <a
                href="https://steamcommunity.com/my/edit/settings"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-tertiary hover:underline"
              >
                <span>{t("step1Action")}</span>
                <Icon name="open_in_new" className="text-[11px]" />
              </a>
            </div>
          </div>

          {/* Step 2: Trade URL */}
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                <Icon name="swap_horiz" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  {t("step2Title")}
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  {t("step2Desc")}
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className={hasTradeUrl ? "font-bold text-status-live" : "text-text-muted"}>
                {hasTradeUrl ? t("step2StatusOk") : t("step2StatusMissing")}
              </span>
              <Link href="/profile" className="inline-flex items-center gap-0.5 font-medium text-secondary hover:underline">
                <span>{t("step2Action")}</span>
                <Icon name="arrow_forward" className="text-[11px]" />
              </Link>
            </div>
          </div>

          {/* Step 3: Steam Guard */}
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-upcoming/15 text-status-upcoming">
                <Icon name="shield" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  {t("step3Title")}
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  {t("step3Desc")}
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className="font-bold text-status-live">{t("step3Status")}</span>
              <Link href="/verify" className="font-medium text-status-upcoming hover:underline">
                {t("step3Action")}
              </Link>
            </div>
          </div>

          {/* Step 4: KYC Verification */}
          <div className="flex flex-col justify-between rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Icon name="verified" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  {t("step4Title")}
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  {t("step4Desc")}
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className="font-bold text-primary">{t("step4Status")}</span>
              <Link
                href="/user/kyc"
                className="inline-flex items-center gap-0.5 font-bold text-primary hover:underline"
              >
                <span>{t("step4Action")}</span>
                <Icon name="arrow_forward" className="text-[11px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
