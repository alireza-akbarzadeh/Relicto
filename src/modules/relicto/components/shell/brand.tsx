"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";
import { Icon } from "@/components/ui/icon";

/** Relicto wordmarks as drawn in each header family. All link home to the marketplace. */

export function MarketBrand() {
  const t = useTranslations("shell");

  return (
    <Link href="/marketplace" className="group flex items-center gap-space-sm text-start select-none">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)]">
        <Icon name="swords" className="text-[20px] text-on-primary-container" />
      </div>
      <div className="flex flex-col text-start">
        <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary">
          {t("brandName")}
          <span className="ms-1.5 font-light text-primary">{t("brandPro")}</span>
        </span>
        <span className="font-label-badge text-label-badge tracking-wider text-tertiary uppercase">
          {t("brandTagline")}
        </span>
      </div>
    </Link>
  );
}

export function LedgerBrand() {
  const t = useTranslations("shell");

  return (
    <Link href="/marketplace" className="group flex items-center gap-space-sm text-start select-none">
      <div className="flex flex-col text-start">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase transition-colors group-hover:text-primary">
            {t("brandName")}
          </span>
          <span className="rounded bg-primary-container px-space-xs py-0.5 font-label-badge text-label-badge font-bold tracking-wider text-on-primary-container uppercase">
            {t("brandPro")}
          </span>
        </div>
        <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">
          {t("brandTagline")}
        </span>
      </div>
    </Link>
  );
}

export function StudioBrand() {
  const t = useTranslations("shell");

  return (
    <Link href="/marketplace" className="flex items-center gap-space-sm text-start select-none">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-card shadow-[0_0_16px_rgba(244,63,94,0.3)]">
        <Icon name="token" className="text-[24px] text-primary" />
      </div>
      <div className="flex flex-col text-start">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm tracking-wider text-text-primary uppercase">
            {t("brandName")}
          </span>
          <span className="rounded bg-primary-container px-1.5 py-0.5 font-label-badge text-label-badge text-on-primary-container">
            {t("brandPro")}
          </span>
        </div>
        <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">
          {t("brandTagline")}
        </span>
      </div>
    </Link>
  );
}

export function HubBrand() {
  const t = useTranslations("shell");

  return (
    <Link href="/" className="group flex items-center gap-3 text-start select-none">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-container shadow-[0_0_16px_rgba(244,63,94,0.4)] transition-colors group-hover:bg-rose-400">
        <ShieldAlert className="size-5 text-white" />
      </div>
      <div className="flex flex-col text-start">
        <span className="flex items-center gap-1.5 text-lg leading-none font-bold tracking-tight text-white uppercase">
          {t("brandName")}
          <span className="rounded border border-primary/30 bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-primary">
            {t("brandPro")}
          </span>
        </span>
        <span className="mt-1 font-mono text-[9px] tracking-widest text-text-muted uppercase">
          {t("brandTaglineShort")}
        </span>
      </div>
    </Link>
  );
}

export function VaultBrand() {
  const t = useTranslations("shell");

  return (
    <Link href="/marketplace" className="group flex items-center gap-3 text-start select-none">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-tactical bg-surface-container-lowest shadow-[0_0_16px_rgba(245,158,11,0.25)] transition-all group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]">
        <Icon name="shield" className="text-[24px] text-tertiary" />
        <span className="absolute -top-0.5 -end-0.5 h-2 w-2 animate-ping rounded-full bg-status-live" />
        <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-status-live" />
      </div>
      <div className="flex flex-col text-start">
        <div className="flex items-center gap-1.5">
          <span className="font-headline-sm text-[18px] font-bold tracking-tight text-text-primary transition-colors group-hover:text-tertiary">
            {t("brandName")}
          </span>
          <span className="rounded border border-border-subtle bg-surface-container px-1.5 py-0.5 font-label-badge text-[10px] font-bold text-tertiary">
            {t("brandPro")}
          </span>
        </div>
        <span className="font-label-badge text-[10px] leading-none tracking-widest text-text-muted uppercase">
          {t("brandTagline")}
        </span>
      </div>
    </Link>
  );
}
