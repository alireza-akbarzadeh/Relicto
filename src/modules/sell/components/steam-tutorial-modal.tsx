"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { SteamIcon } from "@/components/ui/steam-icon";

export function SteamTutorialModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("tutorialModal");

  const steps = [
    {
      num: t("step1Num"),
      title: t("step1Title"),
      englishTitle: t("step1English"),
      desc: t("step1Desc"),
      actionLabel: t("step1Action"),
      actionHref: "https://steamcommunity.com/my",
    },
    {
      num: t("step2Num"),
      title: t("step2Title"),
      englishTitle: t("step2English"),
      desc: t("step2Desc"),
      actionLabel: t("step2Action"),
      actionHref: "https://steamcommunity.com/my/edit/settings",
    },
    {
      num: t("step3Num"),
      title: t("step3Title"),
      englishTitle: t("step3English"),
      desc: t("step3Desc"),
      actionLabel: t("step3Action"),
      actionHref: "https://steamcommunity.com/my/edit/settings",
    },
    {
      num: t("step4Num"),
      title: t("step4Title"),
      englishTitle: t("step4English"),
      desc: t("step4Desc"),
      actionLabel: t("step4Action"),
      actionHref: "https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={<div>{trigger}</div>} />
      ) : (
        <DialogTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="h-auto gap-1.5 rounded-lg border-white/10 bg-surface-container-lowest px-3 py-1.5 font-headline-sm text-xs font-bold text-text-primary uppercase hover:border-white/20 hover:bg-surface-container"
            >
              <Icon name="menu_book" className="text-[15px] text-tertiary" />
              <span>{t("title")}</span>
            </Button>
          }
        />
      )}

      <DialogContent className="max-w-xl! border-white/10 bg-surface-card p-6 text-text-primary shadow-2xl">
        <DialogHeader className="gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tertiary/20 text-tertiary">
              <SteamIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="font-headline-md text-base font-bold text-text-primary uppercase">
                {t("title")}
              </DialogTitle>
              <span className="font-data-mono-md text-[10px] text-text-muted">
                {t("badge")}
              </span>
            </div>
          </div>
          <DialogDescription className="font-body-sm text-xs text-text-secondary">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 flex flex-col gap-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3 transition-colors hover:border-white/15"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-tertiary/15 font-data-mono-md text-xs font-bold text-tertiary">
                {step.num}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-headline-sm text-xs font-bold text-text-primary">
                    {step.title}
                  </span>
                  <span className="font-data-mono-md text-[10px] text-text-muted">
                    {step.englishTitle}
                  </span>
                </div>
                <p className="font-body-sm text-[11px] leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={step.actionHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-headline-sm text-[11px] font-semibold text-tertiary transition hover:text-tertiary/80 hover:underline"
                  >
                    <span>{step.actionLabel}</span>
                    <Icon name="open_in_new" className="text-[12px]" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-2 flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="font-headline-sm text-xs font-bold text-primary uppercase">
                {t("finalStepTitle")}
              </span>
              <span className="font-body-sm text-[11px] text-text-secondary">
                {t("finalStepDesc")}
              </span>
            </div>
            <Link
              href="/user/kyc"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 font-headline-sm text-xs font-bold text-white uppercase shadow-md transition hover:bg-primary/90"
            >
              <Icon name="verified_user" className="text-[14px]" />
              <span>{t("finalStepAction")}</span>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
