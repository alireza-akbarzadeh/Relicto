"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CountdownText } from "@/components/countdown-text";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { vendorOf } from "../../lib/mobile";
import type { CheckoutItem } from "../../types";

function Line({ item, onRemove }: { item: CheckoutItem; onRemove: () => void }) {
  const vendor = vendorOf(item);
  const dota = item.game.toLowerCase().includes("dota");
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg bg-surface-container p-space-sm shadow-md">
      <div className="flex items-start gap-space-sm">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-lowest">
          <Image src={item.image} alt={item.imageAlt} width={160} height={160} sizes="80px" className="h-full w-full object-cover" />
          <span
            className={cn(
              "absolute bottom-1 left-1 rounded px-1 font-label-badge text-[9px] font-bold uppercase",
              dota ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-lowest/90 text-primary",
            )}
          >
            {item.badge}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate font-headline-sm text-[15px] leading-tight text-text-primary">{item.name}</span>
            <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">{formatMoney(item.price)}</span>
          </div>
          <span className="truncate font-body-sm text-[12px] text-text-secondary">{item.detail}</span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-[10px] text-secondary">{item.marker}</span>
            <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-[10px] text-status-upcoming">{item.bot}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-surface-container-high/50 pt-1">
            <div className="flex items-center gap-1">
              <Icon name="verified_user" className="text-[14px] text-tertiary" />
              <span className="font-body-sm text-[11px] text-text-secondary">{vendor.name}</span>
              {vendor.trust && <span className="font-label-badge text-[10px] font-semibold text-tertiary">({vendor.trust})</span>}
            </div>
            <Button variant={null} size={null} aria-label={`Remove ${item.name}`} onClick={onRemove} className="h-auto border-0 text-text-muted transition-colors hover:text-status-live">
              <Icon name="delete_sweep" className="text-[16px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reservation banner with the lock countdown, then the basket lines (live cart). */
export function CartLines({ reserveSeconds }: { reserveSeconds: number }) {
  const { items, removeItem, addItem } = useCart();

  const remove = (item: CheckoutItem) => {
    removeItem(item.id);
    toast(`${item.name} released from escrow`, { action: { label: "Undo", onClick: () => addItem(item) } });
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg bg-surface-container-high p-space-sm shadow-md">
        <div className="flex items-center gap-space-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
          </span>
          <span className="font-label-caps text-label-caps tracking-wider text-text-primary uppercase">{items.length} Items In Escrow Cart</span>
        </div>
        <div className="flex items-center gap-1 rounded bg-surface-container-lowest px-2 py-0.5">
          <Icon name="timer" className="text-[14px] text-tertiary" />
          <span className="font-label-badge text-label-badge font-bold tracking-tight text-tertiary">
            <CountdownText seconds={reserveSeconds} format="timer" /> LOCK RESERVED
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        {items.map((item) => (
          <Line key={item.id} item={item} onRemove={() => remove(item)} />
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-space-sm rounded-lg bg-surface-container p-space-lg text-center">
            <Icon name="shopping_bag" className="text-[28px] text-text-muted" />
            <span className="font-body-sm text-body-sm text-text-secondary">Your escrow cart is empty.</span>
            <LinkButton href="/marketplace" className="h-9 rounded border-0 bg-primary-container px-4 font-label-caps text-label-caps font-bold text-on-primary uppercase">
              Browse the market
            </LinkButton>
          </div>
        )}
      </div>
    </>
  );
}
