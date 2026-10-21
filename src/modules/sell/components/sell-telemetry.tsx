"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function SellTelemetry() {
  const t = useTranslations("sellTelemetry");

  return (
    <section className="border-b border-white/6 bg-surface-container-lowest px-margin-desktop py-2">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 font-data-mono-md text-[11px] text-text-secondary md:flex-row md:items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">{t("portal")}</span>
          <span className="text-white/20">/</span>
          <span className="text-text-muted">{t("inventoryOps")}</span>
          <span className="text-white/20">/</span>
          <span className="font-bold text-primary">{t("sellerStudio")}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <TelemetryBadge
            icon="sensors"
            label={t("steamWebAPI")}
            value={t("syncedVal")}
            tone="text-status-upcoming"
          />
          <TelemetryBadge
            icon="shield"
            label={t("mobile2FA")}
            value={t("armedVal")}
            tone="text-tertiary"
          />
          <TelemetryBadge
            icon="bolt"
            label={t("hold")}
            value={t("holdVal")}
            tone="text-primary"
          />
          <TelemetryBadge
            icon="smart_toy"
            label={t("bots")}
            value={t("botsVal")}
            tone="text-secondary"
          />
        </div>
      </div>
    </section>
  );
}

function TelemetryBadge({
  icon,
  label,
  value,
  tone,
}: {
  icon: "sensors" | "shield" | "bolt" | "smart_toy";
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded border border-white/6 bg-surface-card px-2.5 py-1">
      <Icon name={icon} className={cn("text-[13px]", tone)} />
      <span>
        {label}: <strong className={tone}>{value}</strong>
      </span>
    </div>
  );
}
