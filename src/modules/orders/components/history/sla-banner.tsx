"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";

const ACTION = "h-auto flex-1 rounded-lg border-0 px-space-md py-space-sm text-center font-label-caps text-label-caps font-bold uppercase transition-colors md:flex-initial";

/** Escrow SLA promise with dispute and concierge shortcuts. */
export function SlaBanner() {
  const t = useTranslations("orders");

  return (
    <div className="relative flex flex-col items-start justify-between gap-space-lg overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-lg md:flex-row md:items-center">
      <div className="flex items-start gap-space-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
          <Icon name="shield" className="text-[28px]" />
        </div>
        <div className="flex max-w-2xl flex-col gap-1">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-[16px] font-bold tracking-tight text-text-primary uppercase">{t("slaGuaranteeTitle")}</span>
            <span className="rounded bg-tertiary-container/30 px-1.5 font-label-badge text-[10px] font-bold text-tertiary-fixed-dim">{t("slaActive")}</span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary">
            {t("slaGuaranteeDesc", { amount: "$10,000.00 USD" })}
          </p>
        </div>
      </div>
      <div className="flex w-full items-center gap-space-sm md:w-auto">
        <LinkButton
          href="/wiki"
          className={`${ACTION} bg-surface-container text-text-primary hover:bg-surface-container-high`}
        >
          {t("disputeProtocol")}
        </LinkButton>
        <LinkButton
          href="/community"
          className={`${ACTION} flex items-center justify-center gap-space-xs bg-surface-container-high text-status-upcoming hover:bg-surface-bright`}
        >
          <Icon name="support_agent" className="text-[18px]" />
          <span>{t("conciergeSupport")}</span>
        </LinkButton>
      </div>
    </div>
  );
}
