"use client";

import Image from "next/image";
import Link from "next/link";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { CheckoutItem } from "../types";

export function CheckoutItems({ items, onRemove }: { items: CheckoutItem[]; onRemove: (id: string) => void }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-1 px-1 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <h2 className="font-headline-sm text-sm font-bold text-text-primary">
            Items to Deliver
          </h2>
          <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 font-data-mono-md text-xs font-semibold text-text-secondary">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-data-mono-md text-xs text-text-muted">
          <Icon name="timer" className="text-[14px] text-tertiary" />
          <span>Cart Hold:</span>
          <span className="font-semibold text-tertiary">14:38</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 bg-surface-card p-10 text-center">
          <Icon name="add_shopping_cart" className="text-[32px] text-text-muted" />
          <div className="flex flex-col gap-1">
            <span className="font-headline-sm text-sm font-bold text-text-primary">Your cart is empty</span>
            <span className="text-xs text-text-muted">Add items from the marketplace to initiate escrow dispatch.</span>
          </div>
          <Link
            href="/marketplace"
            className="mt-2 rounded-xl bg-primary px-4 py-2 font-headline-sm text-xs font-bold text-white hover:bg-primary/90"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <CheckoutItemRow key={item.id} item={item} onRemove={() => onRemove(item.id)} />
          ))}
        </div>
      )}
    </section>
  );
}

function CheckoutItemRow({ item, onRemove }: { item: CheckoutItem; onRemove: () => void }) {
  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-white/8 bg-surface-card p-4 transition-all hover:border-white/15 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/6 bg-surface-container-lowest shadow-sm">
          <Image src={item.image} alt={item.imageAlt} fill sizes="80px" className="object-cover" />
          {item.wear && (
            <span className="absolute right-1 bottom-1 rounded bg-surface-deep/90 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-status-upcoming">
              {item.wear}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded px-1.5 py-0.5 font-data-mono-md text-[10px] font-semibold uppercase", item.gameTone)}>
              {item.game}
            </span>
            <span className="truncate font-headline-sm text-sm font-bold text-text-primary">
              {item.name}
            </span>
          </div>
          {item.detail && (
            <span className="truncate font-body-sm text-xs text-text-muted">
              {item.detail}
            </span>
          )}
          <div className="flex items-center gap-2 pt-0.5 font-data-mono-md text-[11px] text-text-muted">
            <span className="text-status-upcoming">● Ready for Push</span>
            <span>·</span>
            <span>{item.bot}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <div className="flex flex-col sm:items-end">
          <span className="font-data-mono-lg text-lg font-bold text-text-primary">
            {formatMoney(item.price)}
          </span>
          {item.marketPrice && item.marketPrice > item.price && (
            <span className="font-data-mono-md text-[11px] text-status-upcoming">
              Save {Math.round(((item.marketPrice - item.price) / item.marketPrice) * 100)}% vs Steam
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <NoticeButton
            notice={{ title: `${item.name} saved`, description: "Wishlist sync is available." }}
            aria-label={`Save ${item.name} to wishlist`}
            className="h-auto rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-container-high hover:text-text-primary"
          >
            <Icon name="favorite" className="text-[16px]" />
          </NoticeButton>
          <NoticeButton
            notice={{ title: `${item.name} removed`, description: "Escrow reservation released." }}
            onClickCapture={onRemove}
            aria-label={`Remove ${item.name}`}
            className="h-auto rounded-lg p-1.5 text-text-muted transition-colors hover:bg-error-container/20 hover:text-error"
          >
            <Icon name="close" className="text-[16px]" />
          </NoticeButton>
        </div>
      </div>
    </article>
  );
}
