"use client";

import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatCount, formatMoney } from "@/lib/format";
import type { SearchTournament, SearchTrader } from "../types";

const CARD =
  "group flex flex-col justify-between rounded-lg bg-surface-deep/90 p-space-md shadow-sm transition-all hover:bg-surface-container";
const STATUS = {
  live: { label: "Tournament Live", icon: "sensors", tone: "text-status-live" },
  upcoming: {
    label: "Registration Open",
    icon: "schedule",
    tone: "text-status-upcoming",
  },
  completed: {
    label: "Concluded",
    icon: "military_tech",
    tone: "text-text-muted",
  },
} as const;

function TraderCard({ trader }: { trader: SearchTrader }) {
  return (
    <div className={CARD}>
      <div className="mb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-headline-sm font-bold text-on-primary">
              {trader.initials}
            </div>
            <span className="absolute -right-1 -bottom-1 rounded bg-secondary-container px-1 font-label-badge text-[9px] leading-tight font-bold text-on-secondary-container">
              {trader.level}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-headline-sm text-headline-sm font-bold text-text-primary transition-colors group-hover:text-primary">
                @{trader.handle}
              </span>
              {trader.verified && (
                <Icon
                  name="verified"
                  className="text-[16px] text-status-upcoming"
                />
              )}
            </div>
            <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">
              {trader.role}
            </span>
          </div>
        </div>
        {trader.trust && (
          <span className="rounded bg-status-upcoming/15 px-2 py-0.5 font-data-mono-md text-[11px] font-bold text-status-upcoming">
            {trader.trust} Rep
          </span>
        )}
      </div>
      <div className="mb-space-sm grid grid-cols-2 gap-2 rounded bg-surface-container-lowest p-2 text-center">
        <div>
          <span className="block font-label-badge text-label-badge text-text-muted uppercase">
            Backpack Value
          </span>
          <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">
            {formatMoney(trader.portfolioUsd, { whole: true })}
          </span>
        </div>
        <div>
          <span className="block font-label-badge text-label-badge text-text-muted uppercase">
            Completed Trades
          </span>
          <span className="font-data-mono-md text-data-mono-md font-bold text-text-primary">
            {formatCount(trader.trades)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="font-data-mono-md text-[11px] text-text-muted">
          {trader.listings} live listing{trader.listings === 1 ? "" : "s"}
        </span>
        <NoticeButton
          notice={{
            title: `@${trader.handle}'s storefront`,
            description: "Public trader storefronts are on the roadmap.",
          }}
          className="h-auto gap-1 rounded border-0 bg-surface-container-highest px-3 py-1 font-label-caps text-[11px] tracking-wider text-text-primary uppercase transition-colors hover:bg-surface-bright"
        >
          <Icon name="inventory_2" className="text-[13px]" />
          <span>View Backpack</span>
        </NoticeButton>
      </div>
    </div>
  );
}

function TournamentCard({
  event,
  onNavigate,
}: {
  event: SearchTournament;
  onNavigate: () => void;
}) {
  const status = STATUS[event.status];
  return (
    <div className={CARD}>
      <div className="mb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon
            name={status.icon}
            className={cn(
              "text-[16px]",
              status.tone,
              event.status === "live" && "animate-pulse",
            )}
          />
          <span
            className={cn(
              "font-label-caps text-label-caps font-bold tracking-wider uppercase",
              status.tone,
            )}
          >
            {status.label}
          </span>
        </div>
        {event.format && (
          <span className="rounded bg-surface-container-high px-2 py-0.5 font-data-mono-md text-[11px] font-bold text-tertiary">
            {event.format}
          </span>
        )}
      </div>
      <div className="mb-2 font-headline-sm text-headline-sm font-bold text-text-primary transition-colors group-hover:text-primary">
        {event.name}
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1 font-data-mono-md text-[11px] text-text-muted">
          <Icon name="monetization_on" className="text-[13px] text-tertiary" />
          <span>
            {event.prizeUsd !== null
              ? `${formatMoney(event.prizeUsd, { whole: true })} Prize Pool`
              : "Prize pool TBA"}
          </span>
        </span>
        <LinkButton
          href="/tournaments"
          onClick={onNavigate}
          className="h-auto gap-1 rounded border-0 bg-primary-container/20 px-3 py-1 font-label-caps text-[11px] tracking-wider text-primary uppercase transition-all hover:bg-primary-container hover:text-on-primary-container"
        >
          <Icon name="live_tv" className="text-[13px]" />
          <span>
            {event.status === "live" ? "Live Radar Feed" : "Open Arena"}
          </span>
        </LinkButton>
      </div>
    </div>
  );
}

/** Traders and tournaments whose names match — shown only for a typed query. */
export function EntityResults({
  traders,
  tournaments,
  onNavigate,
}: {
  traders: SearchTrader[];
  tournaments: SearchTournament[];
  onNavigate: () => void;
}) {
  const total = traders.length + tournaments.length;
  if (total === 0) return null;
  return (
    <div className="space-y-space-sm pt-space-xs">
      <div className="flex items-center gap-2 px-1">
        <Icon name="hub" className="text-[18px] text-secondary" />
        <span className="font-label-caps text-label-caps tracking-wider text-text-primary uppercase">
          Verified Traders &amp; Tournament Telemetry
        </span>
        <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-data-mono-md text-[11px] text-secondary">
          {total} {total === 1 ? "match" : "matches"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {traders.map((trader) => (
          <TraderCard key={trader.handle} trader={trader} />
        ))}
        {tournaments.map((event) => (
          <TournamentCard
            key={event.slug}
            event={event}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
