"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";

export function EscrowGuarantee() {
  const t = useTranslations("checkout");

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-white/6 bg-surface-card/70 p-4 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-upcoming/15 text-status-upcoming">
          <Icon name="verified" className="text-[16px]" />
        </div>
        <h3 className="font-headline-sm text-sm font-bold text-text-primary">
          {t("guaranteeTitle")}
        </h3>
      </div>
      <p className="font-body-sm text-xs leading-relaxed text-text-secondary">
        {t("guaranteeDesc")}
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <Icon name="shield_locked" className="text-[14px] text-primary" />
          {t("auditFeature")}
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="verified_user" className="text-[14px] text-primary" />
          {t("antiPhishFeature")}
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="support_agent" className="text-[14px] text-primary" />
          {t("zeroLossFeature")}
        </span>
      </div>
    </section>
  );
}
