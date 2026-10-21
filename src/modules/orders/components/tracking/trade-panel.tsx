"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import type { SentinelBot, TradeToken } from "../../types";
import { CancelOrderButton } from "./cancel-order-button";

function BotHeader({ bot }: { bot: SentinelBot }) {
  const t = useTranslations("orderTracking");

  return (
    <div className="flex flex-col items-start justify-between gap-space-md rounded-lg bg-surface-container-lowest/50 p-space-md pb-space-md sm:flex-row sm:items-center">
      <div className="flex items-center gap-space-md">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-variant shadow-inner">
            <Icon name="smart_toy" className="text-[32px] text-primary" />
          </div>
          <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-status-upcoming text-surface-deep shadow-md">
            <Icon name="check" className="text-[14px] font-bold" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm font-bold text-text-primary">{bot.name}</span>
            <span className="rounded bg-surface-variant px-space-xs py-0.5 font-label-badge text-label-badge font-bold text-status-upcoming uppercase">
              {bot.level}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-space-sm font-label-badge text-label-badge text-text-muted uppercase">
            <span>{bot.memberSince}</span>
            <span className="h-1 w-1 rounded-full bg-surface-variant" />
            <span className="text-tertiary-fixed-dim">{bot.node}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-space-xs font-label-badge text-label-badge text-text-muted uppercase">
        <Icon name="fingerprint" className="text-[16px] text-tertiary-fixed-dim" />
        <span>{t("botOfferId", { id: bot.offerId })}</span>
      </div>
    </div>
  );
}

function TokenWarning({ token }: { token: TradeToken }) {
  const t = useTranslations("orderTracking");

  return (
    <div className="flex flex-col gap-space-xs rounded-lg border border-primary/20 bg-primary/5 p-space-md">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-label-caps text-label-caps font-bold tracking-wider text-primary uppercase">
          <Icon name="security" className="text-[16px]" />
          {t("steamSecurityCheck")}
        </span>
        <span className="font-label-badge text-[10px] text-text-muted">{token.latency}</span>
      </div>
      <div className="flex flex-col gap-space-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-headline-sm text-headline-sm font-semibold text-text-primary">{t("verifyEscrowToken")}</span>
          <span className="font-data-mono-md text-data-mono-md font-bold tracking-wider text-primary">{token.code}</span>
        </div>
        <span className="font-body-sm text-[12px] text-text-secondary">{token.hint}</span>
      </div>
      <p className="font-body-sm text-[12px] text-text-muted">{token.caution}</p>
    </div>
  );
}

/** The primary action card: open the Steam offer, re-send, instructions and cancel. */
export function TradePanel({ code, bot, token }: { code: string; bot: SentinelBot; token: TradeToken }) {
  const t = useTranslations("orderTracking");

  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface-card p-space-lg shadow-xl">
      <BotHeader bot={bot} />
      <TokenWarning token={token} />
      <div className="flex flex-col items-center gap-space-md pt-space-xs sm:flex-row">
        <LinkButton
          href={token.offerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full gap-space-sm rounded-lg border-0 bg-primary-container px-space-lg py-space-md font-headline-sm text-headline-sm font-bold tracking-wider text-on-primary-container uppercase shadow-[0_0_24px_rgba(244,63,94,0.4)] transition-all hover:opacity-95 sm:flex-1"
        >
          <Icon name="sports_esports" className="text-[24px]" />
          <span>{t("openSteamTradeOffer")}</span>
          <Icon name="open_in_new" className="text-[18px]" />
        </LinkButton>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => {
            toast.success(t("reDispatchedToast"), {
              description: t("reDispatchedDesc", { id: bot.offerId }),
            });
          }}
          className="inline-flex h-auto w-full cursor-pointer items-center justify-center gap-space-xs rounded-lg border-0 bg-surface-container px-space-lg py-space-md font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-container-high focus-visible:outline-hidden sm:w-auto"
        >
          <Icon name="refresh" className="text-[18px]" />
          <span>{t("reSendOffer")}</span>
        </Button>
      </div>
      <div className="flex flex-col gap-space-sm rounded-lg bg-surface-container-low/60 p-space-md">
        <span className="font-label-caps text-label-caps font-semibold tracking-wider text-text-muted uppercase">{t("howToConfirm")}</span>
        <div className="grid grid-cols-1 gap-space-md font-body-sm text-[13px] text-text-secondary sm:grid-cols-3">
          {token.instructions.map((item) => (
            <div key={item.step} className="flex items-start gap-space-xs">
              <span className="font-data-mono-md font-bold text-primary">{item.step}</span>
              <span>
                {item.text}
                <strong>{item.strong}</strong>
                {item.tail}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs font-body-sm text-[13px] text-text-muted">
        <div className="flex items-center gap-space-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-status-upcoming" />
          <span>
            {t("apiLatency")} <span className="font-data-mono-md text-text-primary">{token.latency}</span>
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <Link
            href="/wiki"
            className="inline-flex cursor-pointer items-center gap-1 font-label-caps text-label-caps text-text-muted uppercase transition-colors hover:text-text-primary"
          >
            <Icon name="help_center" className="text-[16px]" />
            <span>{t("needAssistance")}</span>
          </Link>
          <CancelOrderButton code={code} />
        </div>
      </div>
    </div>
  );
}
