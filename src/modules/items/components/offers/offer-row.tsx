import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { SELLER_TONE } from "../../lib/tones";
import type { Offer } from "../../types";

/** One seller offer: authority, variant, fulfilment mode, price and checkout. */
export function OfferRow({ offer }: { offer: Offer }) {
  const bot = offer.fulfilment === "bot";
  return (
    <tr className="transition-colors hover:bg-surface-container-high/40">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full font-data-mono-md text-xs font-bold", SELLER_TONE[offer.seller.tone])}>
            {offer.seller.initials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-headline-sm text-sm font-bold text-text-primary">{offer.seller.name}</span>
              {offer.seller.verified && <Icon name="verified" label="Verified merchant" className="text-[16px] text-tertiary" />}
            </div>
            <span className="font-data-mono-md text-[10px] text-emerald-400">{offer.seller.rating}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded px-2 py-0.5 font-label-badge text-[10px] font-bold",
                offer.style.tone === "amber" ? "bg-surface-container-highest text-tertiary" : "bg-surface-container text-status-upcoming",
              )}
            >
              {offer.style.label}
            </span>
            <span className="rounded bg-surface-container px-1.5 py-0.5 font-label-badge text-[10px] text-text-secondary">{offer.quality}</span>
          </div>
          <span className="font-data-mono-md text-[10px] text-text-muted">{offer.gems}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className={cn("flex items-center gap-2", bot ? "text-emerald-400" : "text-status-upcoming")}>
          <Icon name={bot ? "bolt" : "swap_horiz"} className="text-[18px]" />
          <div className="flex flex-col">
            <span className="font-label-caps text-xs font-bold">{bot ? "Instant Bot Escrow" : "P2P Steam Trade"}</span>
            <span className="font-data-mono-md text-[10px] text-text-muted">{offer.fulfilmentNote}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-data-mono-lg text-lg font-bold text-text-primary">{formatMoney(offer.priceUsd)}</span>
            {offer.best && (
              <span className="rounded border border-emerald-500/30 bg-emerald-950/70 px-1 font-label-badge text-[9px] font-bold text-emerald-400">
                BEST OFFER
              </span>
            )}
          </div>
          <span className="font-label-badge text-[10px] text-text-muted">{offer.priceNote}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <NoticeButton
            notice={{ title: `Buying from ${offer.seller.name}`, description: "Checkout opens once escrow payments are wired." }}
            className={cn(
              "h-auto rounded border-0 px-4 py-2 font-label-caps text-xs font-bold transition-all",
              offer.best
                ? "bg-tertiary text-on-tertiary-container shadow-sm hover:bg-tertiary-fixed hover:shadow-md"
                : "border border-border-subtle bg-surface-container text-text-primary hover:bg-tertiary hover:text-on-tertiary-container",
            )}
          >
            BUY NOW
          </NoticeButton>
          {offer.best && (
            <NoticeButton
              notice={{ title: "Added to cart", description: "The cart drawer arrives with the checkout screen." }}
              aria-label={`Add ${offer.seller.name}'s offer to cart`}
              className="h-auto rounded border-border-subtle bg-surface-container p-2 text-text-secondary transition-all hover:bg-surface-container-high hover:text-text-primary"
            >
              <Icon name="add_shopping_cart" className="text-[18px]" />
            </NoticeButton>
          )}
        </div>
      </td>
    </tr>
  );
}
