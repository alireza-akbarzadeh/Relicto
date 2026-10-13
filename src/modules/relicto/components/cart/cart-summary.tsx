import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { quote } from "@/modules/checkout/lib/pricing";

/**
 * What the basket costs, from the same `quote()` the checkout screen and the
 * charge itself use — so the drawer can't quote a total the order won't take.
 *
 * The drawer used to print `Total = subtotal` with a "$0.00 (0% PROMO)" fee
 * line, which silently omitted the combo discount the server applies at three
 * items. Like the checkout panel, this assumes the promo code is applied.
 */
export function CartSummary({
  pricesUsd,
  promo = true,
  onTogglePromo,
}: {
  pricesUsd: number[];
  promo?: boolean;
  onTogglePromo?: (active: boolean) => void;
}) {
  const q = quote(
    pricesUsd.map((price) => Math.round(price * 100)),
    promo,
  );
  const usd = (cents: number) => formatMoney(cents / 100);

  return (
    <div className="mt-1 flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-container-lowest p-space-md">
      <div className="flex items-center justify-between border-b border-border-subtle pb-1.5 font-data-mono-md text-[10px] font-bold tracking-wider text-text-muted uppercase">
        <span>Settlement Breakdown</span>
        <span className="text-status-success">Verified Escrow</span>
      </div>

      <div className="flex items-center justify-between font-body-sm text-xs">
        <span className="text-text-secondary">Items subtotal</span>
        <span className="font-data-mono-md font-bold text-text-primary">{usd(q.subtotalCents)}</span>
      </div>

      {q.comboCents > 0 && (
        <div className="flex items-center justify-between font-body-sm text-xs">
          <span className="text-text-secondary">Bundle relief (3+ items)</span>
          <span className="font-data-mono-md font-semibold text-status-success">−{usd(q.comboCents)}</span>
        </div>
      )}

      {q.promoCents > 0 ? (
        <div className="flex items-center justify-between font-body-sm text-xs">
          <span className="flex items-center gap-1.5 text-text-secondary">
            <span>Promo · TI14-MAJOR-VIP</span>
            {onTogglePromo && (
              <Button
                type="button"
                variant={null}
                size={null}
                onClick={() => onTogglePromo(false)}
                className="h-auto border-0 p-0 text-[11px] text-text-muted hover:text-text-primary underline cursor-pointer"
              >
                (Remove)
              </Button>
            )}
          </span>
          <span className="font-data-mono-md font-semibold text-status-success">−{usd(q.promoCents)}</span>
        </div>
      ) : onTogglePromo ? (
        <div className="flex items-center justify-between font-body-sm text-xs">
          <span className="text-text-secondary">Promo code</span>
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={() => onTogglePromo(true)}
            className="h-auto border-0 p-0 font-data-mono-md text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            Apply TI14-MAJOR-VIP (−$15.00)
          </Button>
        </div>
      ) : null}

      <div className="flex items-center justify-between font-body-sm text-xs">
        <span className="flex items-center gap-1 text-text-secondary">
          Platform trading fee
          <Icon name="info" className="text-[13px] text-text-muted" />
        </span>
        <span className="font-data-mono-md font-semibold text-status-success">{formatMoney(0)}</span>
      </div>

      <div className="flex items-baseline justify-between border-t border-border-subtle pt-2">
        <span className="font-headline-sm text-xs font-bold tracking-wider text-text-primary uppercase">Total settlement</span>
        <span className="font-data-mono-md text-lg font-bold text-tertiary">{usd(q.dueCents)}</span>
      </div>
    </div>
  );
}
