import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import type { SentinelBot, TradeToken } from "../../types";

function BotHeader({ bot }: { bot: SentinelBot }) {
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
      <div className="flex items-center gap-space-xs rounded-lg bg-surface-container px-space-md py-1.5 font-data-mono-md text-[12px] text-text-secondary">
        <Icon name="bolt" className="text-[16px] text-status-upcoming" />
        <span>
          Offer ID: <span className="font-bold text-text-primary">{bot.offerId}</span>
        </span>
      </div>
    </div>
  );
}

function TokenBanner({ token }: { token: TradeToken }) {
  return (
    <div className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-deep p-space-lg shadow-xl">
      <div className="flex flex-col items-start justify-between gap-space-md sm:flex-row sm:items-center">
        <div className="flex items-center gap-space-sm">
          <Icon name="key" className="text-[26px] text-tertiary-fixed-dim" />
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps font-bold tracking-wider text-tertiary-fixed-dim uppercase">Anti-Phishing Trade Token</span>
            <span className="font-body-sm text-body-sm text-text-secondary">{token.hint}</span>
          </div>
        </div>
        <div className="rounded-lg bg-surface-container px-space-lg py-space-sm font-data-mono-lg text-headline-sm font-bold tracking-widest text-tertiary-fixed-dim shadow-inner">
          {token.code}
        </div>
      </div>
      <div className="font-body-sm text-[12px] leading-relaxed text-text-muted">{token.caution}</div>
    </div>
  );
}

/** Sentinel bot identity, anti-phishing token, trade actions and instructions. */
export function TradePanel({ bot, token }: { bot: SentinelBot; token: TradeToken }) {
  return (
    <div className="relative flex flex-col gap-space-lg overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-2xl">
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
      <BotHeader bot={bot} />
      <TokenBanner token={token} />
      <div className="flex flex-col items-center gap-space-md pt-space-xs sm:flex-row">
        <LinkButton
          href={token.offerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full gap-space-sm rounded-lg border-0 bg-primary-container px-space-lg py-space-md font-headline-sm text-headline-sm font-bold tracking-wider text-on-primary-container uppercase shadow-[0_0_24px_rgba(244,63,94,0.4)] transition-all hover:opacity-95 sm:flex-1"
        >
          <Icon name="sports_esports" className="text-[24px]" />
          <span>Open Steam Trade Offer</span>
          <Icon name="open_in_new" className="text-[18px]" />
        </LinkButton>
        <NoticeButton
          notice={{ title: "Trade offer re-sent", description: "Sentinel Bot #42 will dispatch a fresh offer within 30 seconds." }}
          className="h-auto w-full gap-space-xs rounded-lg border-0 bg-surface-container px-space-lg py-space-md font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-container-high sm:w-auto"
        >
          <Icon name="refresh" className="text-[18px]" />
          <span>Re-Send Offer</span>
        </NoticeButton>
      </div>
      <div className="flex flex-col gap-space-sm rounded-lg bg-surface-container-low/60 p-space-md">
        <span className="font-label-caps text-label-caps font-semibold tracking-wider text-text-muted uppercase">How to confirm in 30 seconds:</span>
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
            Steam Web API Gateway latency: <span className="font-data-mono-md text-text-primary">{token.latency}</span>
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <NoticeButton
            notice={{ title: "Support relay", description: "Live escrow support opens with the helpdesk integration." }}
            className="inline-flex h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-label-caps text-text-muted uppercase transition-colors hover:text-text-primary"
          >
            <Icon name="help_center" className="text-[16px]" />
            <span>Need Assistance?</span>
          </NoticeButton>
          <NoticeButton
            notice={{ title: "Cancel order?", description: "Cancellation refunds the escrow once the orders API is wired." }}
            className="inline-flex h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-label-caps text-text-muted uppercase transition-colors hover:text-status-live"
          >
            <Icon name="cancel" className="text-[16px]" />
            <span>Cancel Order</span>
          </NoticeButton>
        </div>
      </div>
    </div>
  );
}
