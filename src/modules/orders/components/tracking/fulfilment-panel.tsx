"use client";

import { useTranslations } from "next-intl";
import { CountdownText } from "@/components/countdown-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Fulfilment } from "../../types";
import { FulfilmentActions } from "./fulfilment-actions";

type Headline = { icon: IconName; tone: string; title: string; body: string };

/** What the viewer is waiting for or has to do, by side and stage. */
function getHeadline(
  t: ReturnType<typeof useTranslations<"orderTracking">>,
  { role, stage, counterparty }: Fulfilment,
): Headline {
  const seller = role === "seller";
  switch (stage) {
    case "awaiting-offer":
      return seller
        ? { icon: "send", tone: "text-tertiary", title: t("hlAwaitingSellerTitle", { counterparty }), body: t("hlAwaitingSellerBody") }
        : { icon: "schedule", tone: "text-status-upcoming", title: t("hlAwaitingBuyerTitle", { counterparty }), body: t("hlAwaitingBuyerBody") };
    case "offer-sent":
      return seller
        ? { icon: "schedule", tone: "text-status-upcoming", title: t("hlOfferSentSellerTitle", { counterparty }), body: t("hlOfferSentSellerBody") }
        : { icon: "swap_horiz", tone: "text-tertiary", title: t("hlOfferSentBuyerTitle"), body: t("hlOfferSentBuyerBody") };
    case "completed":
      return seller
        ? { icon: "payments", tone: "text-emerald-400", title: t("hlCompletedSellerTitle"), body: t("hlCompletedSellerBody") }
        : { icon: "check_circle", tone: "text-emerald-400", title: t("hlCompletedBuyerTitle"), body: t("hlCompletedBuyerBody") };
    case "cancelled":
      return seller
        ? { icon: "cancel", tone: "text-text-muted", title: t("hlCancelledSellerTitle"), body: t("hlCancelledSellerBody") }
        : { icon: "cancel", tone: "text-text-muted", title: t("hlCancelledBuyerTitle"), body: t("hlCancelledBuyerBody") };
    default:
      return { icon: "gavel", tone: "text-status-live", title: t("hlDefaultTitle"), body: t("hlDefaultBody") };
  }
}

/** The peer-to-peer trade panel: the tracker's call to action for whoever is looking. */
export function FulfilmentPanel({ code, fulfilment }: { code: string; fulfilment: Fulfilment }) {
  const t = useTranslations("orderTracking");
  const head = getHeadline(t, fulfilment);

  return (
    <section className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-2xl">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="flex flex-col justify-between gap-space-md sm:flex-row sm:items-start">
        <div className="flex items-start gap-space-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-variant shadow-inner">
            <Icon name={head.icon} className={cn("text-[26px]", head.tone)} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">
              {fulfilment.role === "seller" ? t("p2pSelling") : t("p2pBuying")}
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">{head.title}</h2>
            <p className="max-w-xl font-body-sm text-body-sm text-text-secondary">{head.body}</p>
          </div>
        </div>
        {fulfilment.secondsLeft !== null && (
          <div className="flex shrink-0 flex-col items-start rounded-lg bg-surface-container-lowest px-space-md py-space-sm sm:items-end">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{t("dispatchWindow")}</span>
            <CountdownText seconds={fulfilment.secondsLeft} format="clock" className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary" />
          </div>
        )}
      </div>
      <FulfilmentActions code={code} fulfilment={fulfilment} />
    </section>
  );
}
