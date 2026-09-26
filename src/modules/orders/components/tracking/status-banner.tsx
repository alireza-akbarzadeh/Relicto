import { CountdownText } from "@/components/countdown-text";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import type { OrderTracking } from "../../types";

/** Breadcrumb, protocol title, live status pill and the auto-cancel timer. */
export function StatusBanner({ order }: { order: OrderTracking }) {
  return (
    <div className="relative flex flex-col justify-between gap-space-md overflow-hidden rounded-xl bg-surface-deep p-space-lg shadow-xl lg:flex-row lg:items-center">
      <div className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-status-upcoming/5 blur-3xl" />
      <div className="z-10 flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-text-muted">
          <span className="cursor-pointer transition-colors hover:text-primary">Orders &amp; Escrow</span>
          <span className="text-text-muted">/</span>
          <span className="text-on-surface">Active Trade</span>
          <span className="text-text-muted">/</span>
          <span className="font-data-mono-md text-tertiary-fixed-dim">{order.code}</span>
        </div>
        <div className="mt-space-xs flex flex-wrap items-center gap-space-md">
          <h1 className="flex items-center gap-space-sm font-headline-lg text-headline-lg tracking-tight text-text-primary uppercase">
            <span>{order.protocol}</span>
            <span className="font-body-md font-normal text-text-muted lowercase">{order.version}</span>
          </h1>
          <div className="flex items-center gap-space-xs rounded-full bg-status-upcoming/15 px-space-md py-1.5 font-label-badge text-label-badge text-status-upcoming uppercase shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-upcoming" />
            <span className="font-bold tracking-wider">{order.status}</span>
          </div>
        </div>
      </div>
      <div className="z-10 flex flex-wrap items-center gap-space-md">
        <div className="flex items-center gap-space-md rounded-lg bg-surface-container-low px-space-md py-space-sm shadow-xs">
          <div className="flex flex-col">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">Placed</span>
            <span className="font-data-mono-md text-data-mono-md text-text-primary">{order.placedAgo}</span>
          </div>
          <div className="h-8 w-px bg-surface-variant" />
          <div className="flex flex-col">
            <span className="flex items-center gap-1 font-label-badge text-label-badge font-bold tracking-wider text-status-live uppercase">
              <Icon name="timer" className="text-[14px]" />
              Auto-Cancel In
            </span>
            <CountdownText
              seconds={order.autoCancelSeconds}
              format="clock"
              className="font-data-mono-lg text-data-mono-lg font-bold tracking-wider text-status-live"
            />
          </div>
        </div>
        <NoticeButton
          notice={{ title: "Escrow proof hash", description: "The settlement receipt opens once the escrow API is wired." }}
          className="h-auto gap-space-xs rounded-lg border-0 bg-surface-variant px-space-md py-space-sm font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-bright"
        >
          <Icon name="receipt_long" className="text-[18px]" />
          <span>Proof Hash</span>
        </NoticeButton>
      </div>
    </div>
  );
}
