"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { CounterOfferDialog } from "@/modules/offers/components/counter-offer-dialog";
import { useOfferWrites } from "@/modules/offers/hooks/use-offer-writes";
import type { IncomingOffer } from "@/modules/offers/types";

export function MobileOffersInbox({ offers }: { offers: IncomingOffer[] }) {
  const [counterOffer, setCounterOffer] = useState<IncomingOffer | null>(null);
  const { pending, accept, decline } = useOfferWrites();

  return (
    <section id="offers" className="w-full scroll-mt-20 px-space-md py-space-md">
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <Icon name="sell" className="text-[20px] text-tertiary" />
            <h2 className="font-headline-sm text-sm font-bold tracking-wide text-text-primary uppercase">
              Incoming Offers
            </h2>
            <span className="rounded bg-tertiary/20 px-2 py-0.5 font-data-mono-md text-[10px] font-bold text-tertiary">
              {offers.length} Open
            </span>
          </div>
        </div>
        <p className="font-body-sm text-[11px] text-text-muted">
          Accepting debits the buyer&apos;s vault and opens escrow at their bid price.
        </p>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-surface-container-low/50 px-space-md py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-text-muted">
              <Icon name="mail" className="text-[20px]" />
            </div>
            <span className="mt-2 font-headline-sm text-xs font-semibold text-text-primary">
              No Open Offers
            </span>
            <span className="mt-1 max-w-xs font-body-sm text-[11px] text-text-muted">
              Buyers can place bids on any of your live listings from its item detail page.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-space-sm">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col gap-space-sm rounded-xl border border-border-subtle bg-surface-container-low p-space-md shadow-xs transition-all"
              >
                {/* Item header */}
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/items/${offer.item.slug}`} className="flex min-w-0 items-center gap-space-sm">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest">
                      {offer.item.image && (
                        <Image
                          src={offer.item.image}
                          alt={offer.item.imageAlt}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-headline-sm text-xs font-semibold text-text-primary">
                        {offer.item.name}
                      </span>
                      <span className="font-data-mono-md text-[10px] text-text-muted">
                        Asking {formatMoney(offer.askUsd)}
                      </span>
                    </div>
                  </Link>

                  <div className="flex shrink-0 flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="font-data-mono-lg text-base font-bold text-tertiary">
                        {formatMoney(offer.bidUsd)}
                      </span>
                      {offer.top && (
                        <span className="rounded border border-emerald-500/30 bg-emerald-950/70 px-1 font-label-badge text-[9px] font-bold text-emerald-400">
                          TOP BID
                        </span>
                      )}
                    </div>
                    <span className="font-data-mono-md text-[10px] text-status-upcoming">
                      {offer.discount} vs ask
                    </span>
                  </div>
                </div>

                {/* Bidder info & time */}
                <div className="flex items-center justify-between border-t border-border-subtle/50 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-high font-data-mono-md text-[9px] font-bold text-text-primary">
                      {offer.bidder.initials}
                    </div>
                    <span className="font-body-sm text-[11px] font-medium text-text-primary">
                      {offer.bidder.name}
                    </span>
                    <span className="font-data-mono-md text-[10px] text-emerald-400">
                      {offer.bidder.trust}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-data-mono-md text-[10px] text-text-muted">
                    <span className={cn(offer.expires.startsWith("under") ? "text-error" : "text-text-secondary")}>
                      {offer.expires}
                    </span>
                  </div>
                </div>

                {/* Optional buyer note */}
                {offer.note && (
                  <p className="rounded bg-surface-container-lowest/70 px-2 py-1 font-body-sm text-[11px] text-text-secondary italic">
                    “{offer.note}”
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant={null}
                    size={null}
                    disabled={pending}
                    onClick={() => decline(offer.id, offer.item.name)}
                    className="h-8 rounded-lg border border-border-subtle bg-surface-container px-3 font-label-caps text-xs font-semibold text-text-secondary transition-all hover:bg-surface-container-high hover:text-text-primary active:scale-95 disabled:opacity-50"
                  >
                    Decline
                  </Button>
                  <Button
                    variant={null}
                    size={null}
                    disabled={pending}
                    onClick={() => setCounterOffer(offer)}
                    className="flex h-8 items-center gap-1 rounded-lg border border-border-subtle bg-surface-container px-2.5 font-label-caps text-xs font-semibold text-tertiary transition-all hover:bg-surface-container-high hover:text-text-primary active:scale-95 disabled:opacity-50"
                  >
                    <Icon name="swap_horiz" className="text-[14px]" />
                    Counter
                  </Button>
                  <Button
                    variant={null}
                    size={null}
                    disabled={pending}
                    onClick={() => accept(offer.id, offer.item.name)}
                    className="flex h-8 items-center gap-1 rounded-lg border-0 bg-tertiary px-3 font-label-caps text-xs font-bold text-on-tertiary-container shadow-xs transition-all hover:bg-tertiary-fixed active:scale-95 disabled:opacity-50"
                  >
                    <Icon name="check" className="text-[16px]" />
                    Accept {formatMoney(offer.bidUsd)}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {counterOffer && (
        <CounterOfferDialog
          open={Boolean(counterOffer)}
          onOpenChange={(open) => !open && setCounterOffer(null)}
          offer={counterOffer}
        />
      )}
    </section>
  );
}
