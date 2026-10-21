"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import type { LedgerData } from "../../types";

/** Page title, live sync badge and the cold-vault insurance tag. */
export function LedgerIntro({ poll, vault }: { poll: string; vault: LedgerData["vault"] }) {
  const t = useTranslations("orders");

  return (
    <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="rounded bg-surface-container-high px-space-xs py-0.5 font-label-badge text-label-badge font-bold tracking-widest text-status-upcoming uppercase">
            {t("badge")}
          </span>
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
          <span className="font-label-badge text-label-badge text-text-muted">{poll}</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-text-primary uppercase">
          {t("title")}
        </h1>
        <p className="max-w-2xl font-body-md text-body-md text-text-secondary">
          {t("description")}
        </p>
      </div>
      <div className="flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-sm shadow-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-tertiary-fixed-dim">
          <Icon name="verified_user" className="text-[24px]" />
        </div>
        <div className="flex flex-col">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">{vault.label}</span>
          <div className="flex items-center gap-space-xs">
            <span className="font-data-mono-md text-data-mono-md font-bold text-text-primary">{vault.value}</span>
            <span className="rounded bg-tertiary-container/30 px-1.5 font-label-badge text-[10px] font-bold text-tertiary-fixed-dim">{vault.tier}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
