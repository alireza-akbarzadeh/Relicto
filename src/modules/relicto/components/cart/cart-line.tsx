"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import type { CheckoutItem } from "@/modules/checkout/types";

/** One reserved copy in the basket. */
export function CartLine({
  item,
  onRemove,
  onNavigate,
}: {
  item: CheckoutItem;
  onRemove: (id: string) => void;
  onNavigate: () => void;
}) {
  /** The line links to its item; `slug` is present on server rows, `id` on optimistic ones. */
  const href = `/items/${item.slug ?? item.id}`;

  return (
    <div className="group relative flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface-container-low p-3 transition-colors hover:border-border-highlight hover:bg-surface-container-high">
      <div className="flex items-start gap-3">
        <Link
          href={href}
          onClick={onNavigate}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-container-lowest"
        >
          {item.image && (
            <Image
              src={item.image}
              alt={item.imageAlt || item.name}
              fill
              sizes="80px"
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {item.wear && (
            <span className="absolute bottom-1 left-1 rounded border border-border-tactical bg-surface-overlay px-1 py-0.5 font-data-mono-md text-[9px] font-bold tracking-tight text-tertiary uppercase backdrop-blur-md">
              {item.wear}
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="truncate font-data-mono-md text-[10px] font-bold tracking-wider text-tertiary uppercase">
                {item.category || item.badge || item.game}
              </span>
              <Button
                variant={null}
                size={null}
                aria-label={`Remove ${item.name} from basket`}
                onClick={() => onRemove(item.id)}
                className="h-auto rounded border-0 p-0.5 text-text-muted transition-colors hover:bg-surface-container hover:text-primary"
              >
                <Icon name="close" className="text-[16px]" />
              </Button>
            </div>

            <Link href={href} onClick={onNavigate} className="block">
              <h3 className="mt-0.5 truncate font-headline-sm text-sm leading-snug font-bold text-text-primary transition-colors hover:text-tertiary">
                {item.name}
              </h3>
            </Link>
            {item.subname && <div className="truncate font-body-sm text-xs font-medium text-text-secondary">{item.subname}</div>}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {item.floatValue !== undefined && (
              <span className="rounded border border-border-subtle bg-surface-container-lowest px-1.5 py-0.5 font-data-mono-md text-[10px] text-text-muted">
                Float <span className="font-semibold text-tertiary">{item.floatValue}</span>
              </span>
            )}
            {item.paintSeed !== undefined && (
              <span className="rounded border border-border-subtle bg-surface-container-lowest px-1.5 py-0.5 font-data-mono-md text-[10px] text-text-muted">
                #{item.paintSeed}
              </span>
            )}
            <span className="rounded border border-border-subtle bg-surface-container-lowest px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-status-success">
              0-Hold
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-data-mono-md text-base font-bold text-text-primary">{formatMoney(item.price)}</span>
          {item.discountPercentage !== undefined && item.discountPercentage > 0 && (
            <span className="rounded bg-surface-container px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-status-success">
              −{item.discountPercentage}% vs Steam
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 rounded border border-border-tactical bg-surface-container px-2 py-0.5 font-data-mono-md text-[10px] text-tertiary">
          <Icon name="lock" className="text-[12px]" />
          Escrow ready
        </span>
      </div>
    </div>
  );
}
