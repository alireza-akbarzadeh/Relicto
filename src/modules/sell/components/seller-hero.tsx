"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { SellerToolbar, type SellerToolbarProps } from "./seller-toolbar";

export type SellerHeroProps = SellerToolbarProps;

export function SellerHero(props: SellerHeroProps) {
  const { tradableCount } = props;
  const t = useTranslations("sellerHero");

  return (
    <section className="border-b border-white/6 bg-surface-deep px-margin-desktop py-space-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-space-md">
        <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
          <div className="flex max-w-3xl flex-col gap-1.5">
            <div className="flex items-center gap-space-sm">
              <span className="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 font-label-badge text-[10px] font-bold tracking-widest text-primary uppercase">
                {t("terminalBadge")}
              </span>
              <span className="rounded bg-surface-container-highest px-2 py-0.5 font-data-mono-md text-[10px] text-secondary">
                {t("tacticalCore")}
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl font-bold tracking-tight text-text-primary uppercase lg:text-3xl">
              {t("title")}{" "}
              <span className="font-normal text-primary">{t("titleBadge")}</span>
            </h1>
            <p className="font-body-md text-xs leading-relaxed text-text-secondary sm:text-sm">
              {t("description")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/8 bg-surface-card px-4 py-3 shadow-lg">
            <Stat label={t("feeRate")} value="2.0%" note={t("vipTier")} tone="text-primary" />
            <Stat label={t("tradableUnits")} value={String(tradableCount)} tone="text-tertiary" />
            <Stat label={t("avgLiquidation")} value={t("avgLiquidationVal")} tone="text-text-primary" />
          </div>
        </div>

        <SellerToolbar {...props} />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note?: string;
  tone: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-label-badge text-[10px] text-text-muted uppercase">{label}</span>
      <div className={cn("mt-0.5 font-data-mono-lg text-lg font-bold", tone)}>{value}</div>
      {note && <span className="font-label-badge text-[9px] text-status-upcoming">{note}</span>}
    </div>
  );
}
