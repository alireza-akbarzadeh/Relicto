"use client";

import { useTranslations } from "next-intl";

export function ExecutionTerminal() {
  const t = useTranslations("alerts.terminal");

  return (
    <section className="rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">
          {t("execTerminal")}
        </h2>
        <span className="font-label-badge text-[10px] text-status-live">
          {t("streaming")}
        </span>
      </div>
      <div className="mt-3 rounded bg-surface-container-lowest p-3 font-data-mono-md text-[11px] leading-relaxed text-text-secondary">
        <p>
          <b className="text-tertiary">[14:02:18]</b> {t("log1")}
        </p>
        <p>
          <b className="text-tertiary">[14:02:19]</b> {t("log2")}
        </p>
        <p>
          <b className="text-tertiary">[14:02:21]</b> {t("log3")}
        </p>
        <p>
          <b className="text-tertiary">[14:03:04]</b> {t("log4")}
        </p>
      </div>
    </section>
  );
}

export function Performance() {
  const t = useTranslations("alerts.terminal");

  return (
    <section className="rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">
          {t("algoPerf")}
        </h2>
        <span className="font-data-mono-md text-primary">+14.2% ROI</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          [t("capturedProfit"), "$4,892.40"],
          [t("escrowHandshake"), "240ms"],
          [t("execSuccess"), "96.8%"],
          [t("maxVault"), "$64,800"],
        ].map(([label, value]) => (
          <div key={label} className="rounded bg-surface-container-lowest p-3">
            <span className="block font-label-badge text-[10px] text-text-muted uppercase">
              {label}
            </span>
            <b className="font-data-mono-lg text-data-mono-lg text-tertiary">
              {value}
            </b>
          </div>
        ))}
      </div>
      <div className="mt-3 font-label-badge text-[10px] text-text-muted uppercase">
        {t("notificationPaths")}{" "}
        <span className="text-status-upcoming">Discord</span> · Telegram · Web
        Push · Twilio SMS
      </div>
    </section>
  );
}
