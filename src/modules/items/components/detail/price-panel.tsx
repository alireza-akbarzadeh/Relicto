import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { ESCROW_TONE, STAT_TONE } from "../../lib/tones";
import type { ItemDetail } from "../../types";

const ACTION = "h-auto rounded-lg border-border-subtle bg-surface-container py-3 font-headline-sm text-sm transition-all hover:bg-surface-container-high";

/** Title, description, live valuation and the buy / watch actions. */
export function PricePanel({ item }: { item: ItemDetail }) {
  const { price } = item;
  return (
    <div className="flex flex-col justify-between gap-4 lg:col-span-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="font-label-badge text-[11px] font-semibold tracking-wider text-status-upcoming uppercase">{item.eyebrow.game}</span>
          <span>•</span>
          <span className="font-label-badge text-[11px] text-text-secondary uppercase">{item.eyebrow.slot}</span>
          <span>•</span>
          <span className="font-label-badge text-[11px] font-semibold text-primary-fixed uppercase">{item.eyebrow.hero}</span>
        </div>
        <h1 className="mt-2 font-display-hero text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{item.name}</h1>
        <p className="mt-2.5 font-body-md text-sm leading-relaxed text-text-secondary">{item.description}</p>

        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-card p-5 shadow-xl">
          <div className="flex flex-col justify-between gap-3 rounded border border-border-subtle/50 bg-surface-container-lowest/60 p-4 pb-3 sm:flex-row sm:items-end">
            <div>
              <span className="mb-1 block font-label-badge text-[10px] tracking-wider text-text-muted uppercase">Lowest Real-Time Price</span>
              <div className="flex items-baseline gap-2">
                <span className="font-data-mono-lg text-4xl font-bold tracking-tight text-text-primary">{formatMoney(price.lowestUsd)}</span>
                <span className="font-data-mono-md text-sm text-text-muted">USD</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 font-data-mono-md text-sm font-semibold text-emerald-400">
                  <Icon name="trending_up" className="text-[16px]" />
                  {price.moveLabel}
                </div>
                <span className="font-label-badge text-[10px] text-text-muted">{price.moveNote}</span>
              </div>
              <div className="h-8 w-px bg-surface-container-high" />
              <div className="flex flex-col items-end">
                <span className="font-data-mono-md text-sm font-semibold text-emerald-400">{price.trendLabel}</span>
                <span className="font-label-badge text-[10px] text-text-muted">{price.trendNote}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            {price.stats.map((stat) => (
              <div key={stat.label} className="rounded border border-border-subtle/40 bg-surface-container-lowest p-2.5">
                <span className="block font-label-badge text-[10px] text-text-muted uppercase">{stat.label}</span>
                <span className={cn("font-data-mono-md text-sm font-semibold", STAT_TONE[stat.tone])}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-stretch gap-2.5 pt-1 sm:flex-row">
            <NoticeButton
              notice={{ title: `Reserved ${item.name}`, description: "Instant buy completes once escrow payments are wired." }}
              className="h-auto flex-1 gap-2 rounded-lg border-0 bg-tertiary px-6 py-3 font-headline-sm text-sm font-bold tracking-wider text-on-tertiary-container uppercase shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all hover:bg-tertiary-fixed hover:shadow-[0_0_32px_rgba(245,158,11,0.5)] active:scale-[0.99]"
            >
              <Icon name="bolt" className="text-[20px]" />
              <span>Instant Buy — {formatMoney(price.lowestUsd)}</span>
            </NoticeButton>
            <NoticeButton
              notice={{ title: "Added to cart", description: "The cart drawer arrives with the checkout screen." }}
              aria-label="Add to cart"
              className={cn(ACTION, "gap-2 px-4 font-semibold text-text-primary")}
            >
              <Icon name="add_shopping_cart" className="text-[20px]" />
              <span className="hidden sm:inline">Add</span>
            </NoticeButton>
            <NoticeButton
              notice={{ title: "Added to watchlist", description: "Watchlists sync with your account once auth is wired." }}
              aria-label="Add to watchlist"
              className={cn(ACTION, "px-3.5 text-text-secondary hover:text-primary")}
            >
              <Icon name="favorite" className="text-[20px]" />
            </NoticeButton>
            <NoticeButton
              notice={{ title: "Price ping", description: "Configure the alert threshold in the panel below." }}
              aria-label="Configure price drop ping"
              className={cn(ACTION, "px-3.5 text-text-secondary hover:text-tertiary")}
            >
              <Icon name="notifications_active" className="text-[20px]" />
            </NoticeButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
        {item.escrow.map((badge) => (
          <div key={badge.title} className="flex items-center gap-2.5 rounded border border-border-subtle bg-surface-container-lowest p-2.5">
            <Icon name={badge.icon} className={cn("text-[20px]", ESCROW_TONE[badge.tone])} />
            <div className="flex flex-col">
              <span className="font-label-badge text-[11px] font-bold text-text-primary">{badge.title}</span>
              <span className="font-body-sm text-[10px] text-text-muted">{badge.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
