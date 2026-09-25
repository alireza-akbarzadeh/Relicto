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
export function CartSummary({ pricesUsd }: { pricesUsd: number[] }) {
  const q = quote(
    pricesUsd.map((price) => Math.round(price * 100)),
    true,
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

      {q.promoCents > 0 && (
        <div className="flex items-center justify-between font-body-sm text-xs">
          <span className="text-text-secondary">Promo · TI14-MAJOR-VIP</span>
          <span className="font-data-mono-md font-semibold text-status-success">−{usd(q.promoCents)}</span>
        </div>
      )}

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
