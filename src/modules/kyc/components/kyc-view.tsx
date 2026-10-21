"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { KycForm } from "./kyc-form";

export function KycView({
  handle,
  tradeUrl,
  realName,
}: {
  handle?: string;
  tradeUrl?: string;
  realName?: string;
}) {
  const t = useTranslations("kyc");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-margin-desktop py-space-xl">
      {/* Header banner */}
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-surface-card p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 font-label-badge text-[10px] font-bold tracking-widest text-primary uppercase">
            {t("badge")}
          </span>
          <span className="font-data-mono-md text-[10px] text-text-muted">
            {t("compliance")}
          </span>
        </div>
        <h1 className="font-headline-xl text-2xl font-bold tracking-tight text-text-primary uppercase sm:text-3xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl font-body-md text-xs leading-relaxed text-text-secondary sm:text-sm">
          {t("description")}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-live/15 text-status-live">
              <Icon name="bolt" className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-xs font-bold text-text-primary">{t("instantPayout")}</span>
              <span className="font-data-mono-md text-[10px] text-text-muted">{t("instantPayoutDesc")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/15 text-tertiary">
              <Icon name="verified_user" className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-xs font-bold text-text-primary">{t("verifiedBadge")}</span>
              <span className="font-data-mono-md text-[10px] text-text-muted">{t("verifiedBadgeDesc")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
              <Icon name="shield_locked" className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-xs font-bold text-text-primary">{t("botProtection")}</span>
              <span className="font-data-mono-md text-[10px] text-text-muted">{t("botProtectionDesc")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-xl border border-white/10 bg-surface-card p-6 shadow-xl backdrop-blur-md sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Icon name="badge" className="text-[18px]" />
            </div>
            <h2 className="font-headline-md text-base font-bold text-text-primary uppercase">
              {t("formTitle")}
            </h2>
          </div>
          <span className="font-data-mono-md text-xs text-text-muted">
            {t("accountLabel")} <span className="font-semibold text-text-primary">{handle ? `@${handle}` : "User"}</span>
          </span>
        </div>

        <KycForm
          initialHandle={handle}
          initialTradeUrl={tradeUrl}
          initialRealName={realName}
        />
      </div>
    </div>
  );
}
