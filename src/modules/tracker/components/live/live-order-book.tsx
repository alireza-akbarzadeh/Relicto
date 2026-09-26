"use client";

import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useLiveBook, type StreamState } from "../../hooks/use-live-book";
import type { BookLevel, LiveBook } from "../../types";

const STATE: Record<StreamState, { label: string; tone: string; dot: string }> = {
  live: { label: "Live", tone: "text-status-upcoming", dot: "bg-status-upcoming animate-pulse" },
  polling: { label: "Polling", tone: "text-tertiary", dot: "bg-tertiary" },
  connecting: { label: "Connecting", tone: "text-text-muted", dot: "bg-text-muted animate-pulse" },
  offline: { label: "Offline", tone: "text-status-live", dot: "bg-status-live" },
};

function Level({ level, side, widest }: { level: BookLevel; side: "ask" | "bid"; widest: number }) {
  const ask = side === "ask";
  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded px-2 py-1.5 font-data-mono-md text-[11px]">
      {/* Depth bar: how much sits at this price against the busiest level. */}
      <span
        className={cn("absolute inset-y-0 right-0 transition-[width] duration-500", ask ? "bg-primary/10" : "bg-status-upcoming/10")}
        style={{ width: `${Math.max(6, (level.quantity / widest) * 100)}%` }}
      />
      <span className={cn("relative font-bold", ask ? "text-primary" : "text-status-upcoming")}>{formatMoney(level.priceUsd)}</span>
      <span className="relative text-text-muted">{level.quantity} {ask ? "listed" : level.quantity === 1 ? "bid" : "bids"}</span>
      <span className="relative text-right text-text-primary">{formatMoney(level.priceUsd * level.quantity)}</span>
    </div>
  );
}

/**
 * Relicto's live order book for the focused item: listings above the spread,
 * open offers below, streamed as they change. The best ask sits nearest the spread.
 */
export function LiveOrderBook({ initial }: { initial: LiveBook }) {
  const { book, state, changedAt } = useLiveBook(initial);
  const widest = Math.max(1, ...book.asks.map((l) => l.quantity), ...book.bids.map((l) => l.quantity));
  const status = STATE[state];

  return (
    <section className="flex flex-col gap-space-md rounded-xl border border-white/8 bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-headline-sm text-headline-sm text-text-primary">
          <Icon name="view_list" className="text-[18px] text-primary" />
          Order Book
        </h2>
        <span className={cn("flex items-center gap-1.5 font-label-badge text-[10px] uppercase", status.tone)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>

      <div key={changedAt ?? 0} className="flex flex-col gap-1 animate-in fade-in-50 duration-300">
        <div className="grid grid-cols-[1fr_auto_1fr] px-2 font-label-badge text-[10px] text-text-muted uppercase">
          <span>Price</span>
          <span>Size</span>
          <span className="text-right">Total</span>
        </div>
        {[...book.asks].reverse().map((level) => <Level key={`a-${level.priceUsd}`} level={level} side="ask" widest={widest} />)}
        {book.asks.length === 0 && <span className="px-2 py-2 font-body-sm text-xs text-text-muted">No copies listed.</span>}
        <div className="my-1 flex items-center justify-between rounded bg-surface-container-lowest px-2 py-1.5 font-data-mono-md text-[11px]">
          <span className="text-text-muted uppercase">Spread</span>
          <span className="font-bold text-tertiary">
            {book.spreadUsd !== null ? `${formatMoney(book.spreadUsd)} (${book.spreadPct?.toFixed(2)}%)` : "—"}
          </span>
        </div>
        {book.bids.map((level) => <Level key={`b-${level.priceUsd}`} level={level} side="bid" widest={widest} />)}
        {book.bids.length === 0 && <span className="px-2 py-2 font-body-sm text-xs text-text-muted">No open offers yet.</span>}
      </div>

      <div className="flex justify-between rounded bg-surface-container-lowest px-2 py-2 font-label-badge text-[10px] text-text-muted uppercase">
        <span>Listed depth <b className="text-status-upcoming">{formatMoney(book.depthUsd)}</b></span>
        <span>{new Date(book.at).toLocaleTimeString("en-US", { hour12: false })}</span>
      </div>
      <LinkButton
        href={`/items/${book.slug}#offers`}
        className="h-auto gap-1 rounded bg-primary-container py-2 font-label-caps text-label-caps font-bold text-on-primary-container uppercase"
      >
        <Icon name="bolt" className="text-[16px]" />
        {book.bestAsk !== null ? `Buy best ask (${formatMoney(book.bestAsk)})` : "Open the item"}
      </LinkButton>
    </section>
  );
}
