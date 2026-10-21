"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { COMBO_DISCOUNT_CENTS, COMBO_THRESHOLD } from "../lib/pricing";

export function ComboBanner({ comboDiscount, itemCount }: { comboDiscount: number; itemCount: number }) {
  const t = useTranslations("checkout");

  if (comboDiscount > 0) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-tertiary/30 bg-surface-card p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
              <Icon name="stars" className="text-[20px]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-xs font-bold text-tertiary">
                  {t("bundleActivated")}
                </span>
                <span className="rounded bg-tertiary-container/40 px-1.5 py-0.5 font-data-mono-md text-[10px] text-tertiary">
                  {t("bundleItems", { count: itemCount })}
                </span>
              </div>
              <span className="font-body-sm text-xs text-text-secondary">
                {t("bundleDesc", { amount: formatMoney(comboDiscount) })}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-white/6 bg-surface-container-lowest px-3 py-1.5 text-right sm:self-center">
            <span className="block font-data-mono-md text-[10px] text-text-muted">{t("rebateApplied")}</span>
            <span className="font-data-mono-md text-sm font-bold text-tertiary">
              -${formatMoney(comboDiscount)}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (itemCount > 0 && itemCount < COMBO_THRESHOLD) {
    const needed = COMBO_THRESHOLD - itemCount;
    const rebateAmount = formatMoney(COMBO_DISCOUNT_CENTS / 100);
    return (
      <section className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-surface-card/60 p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <Icon name="auto_awesome" className="text-[18px]" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-xs font-bold text-text-primary">
            {t("unlockRebateTitle", { amount: rebateAmount })}
          </span>
          <span className="font-body-sm text-xs text-text-muted">
            {t("unlockRebateDesc", { needed, items: needed === 1 ? t("itemsWord_one") : t("itemsWord_other") })}
          </span>
        </div>
      </section>
    );
  }

  return null;
}
