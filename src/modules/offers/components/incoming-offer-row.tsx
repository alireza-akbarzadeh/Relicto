"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useOfferWrites } from "../hooks/use-offer-writes";
import type { IncomingOffer } from "../types";

/** One bid on the seller's listing, with the two answers they can give. */
export function IncomingOfferRow({ offer }: { offer: IncomingOffer }) {
  const { pending, accept, decline } = useOfferWrites();

  return (
    <tr className="border-t border-border-subtle transition-colors hover:bg-surface-container-high/30">
      <td className="px-3 py-2.5">
        <Link href={`/items/${offer.item.slug}`} className="flex items-center gap-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded bg-surface-container-lowest">
            {offer.item.image && <Image src={offer.item.image} alt={offer.item.imageAlt} fill sizes="36px" className="object-cover" />}
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-[13px] font-semibold text-text-primary">{offer.item.name}</span>
            <span className="font-data-mono-md text-[10px] text-text-muted">Asking {formatMoney(offer.askUsd)}</span>
          </div>
        </Link>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high font-data-mono-md text-[10px] font-bold text-text-primary">
            {offer.bidder.initials}
          </div>
          <div className="flex flex-col">
            <span className="font-body-sm text-xs font-semibold text-text-primary">{offer.bidder.name}</span>
            <span className="font-data-mono-md text-[10px] text-emerald-400">{offer.bidder.trust}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-data-mono-md text-sm font-bold text-tertiary">{formatMoney(offer.bidUsd)}</span>
            {offer.top && (
              <span className="rounded border border-emerald-500/30 bg-emerald-950/70 px-1 font-label-badge text-[9px] font-bold text-emerald-400">TOP BID</span>
            )}
          </div>
          <span className="font-data-mono-md text-[10px] text-status-upcoming">{offer.discount} vs ask</span>
        </div>
      </td>
      <td className="max-w-56 px-3 py-2.5 font-body-sm text-[11px] text-text-secondary">
        {offer.note ? <span className="line-clamp-2">“{offer.note}”</span> : <span className="text-text-muted">—</span>}
      </td>
      <td className="px-3 py-2.5 font-data-mono-md text-[11px] text-text-muted">
        <div className="flex flex-col">
          <span>{offer.placed}</span>
          <span className={cn(offer.expires.startsWith("under") ? "text-error" : "text-text-secondary")}>{offer.expires}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant={null}
            size={null}
            disabled={pending}
            onClick={() => decline(offer.id, offer.item.name)}
            className="h-auto rounded border-0 bg-surface-container px-2 py-1 font-label-caps text-[10px] text-text-secondary uppercase hover:text-error"
          >
            Decline
          </Button>
          <Button
            variant={null}
            size={null}
            disabled={pending}
            onClick={() => accept(offer.id, offer.item.name)}
            className="h-auto gap-1 rounded border-0 bg-primary/20 px-2 py-1 font-label-caps text-[10px] text-primary uppercase hover:bg-primary/30"
          >
            <Icon name="check" className="text-[12px]" />
            Accept {formatMoney(offer.bidUsd, { whole: offer.bidUsd >= 1000 })}
          </Button>
        </div>
      </td>
    </tr>
  );
}
