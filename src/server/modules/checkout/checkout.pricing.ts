/**
 * Basket arithmetic, shared by the quote the screen shows and the charge the
 * order actually takes — the two must never disagree.
 */

/** Bundle relief once the basket holds this many items. */
const COMBO_THRESHOLD = 3;
const COMBO_DISCOUNT_CENTS = 2500;
/** The tournament code the settlement panel offers (`TI14-MAJOR-VIP`). */
const PROMO_DISCOUNT_CENTS = 1500;

export type Quote = {
  subtotalCents: number;
  comboCents: number;
  promoCents: number;
  dueCents: number;
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function quote(priceCents: number[], promo: boolean): Quote {
  const subtotalCents = sum(priceCents);
  const comboCents = priceCents.length >= COMBO_THRESHOLD ? COMBO_DISCOUNT_CENTS : 0;
  const promoCents = promo ? PROMO_DISCOUNT_CENTS : 0;

  return {
    subtotalCents,
    comboCents,
    promoCents,
    // A discount never pays the buyer.
    dueCents: Math.max(0, subtotalCents - comboCents - promoCents),
  };
}

/**
 * Splits a basket-wide discount over its lines in proportion to price, so the
 * per-line orders add up to exactly what was charged. Leftover cents go to the
 * priciest lines first.
 */
export function allocate(priceCents: number[], discountCents: number): number[] {
  const subtotal = sum(priceCents);
  const discount = Math.min(discountCents, subtotal);
  if (discount === 0) return priceCents.map(() => 0);

  const shares = priceCents.map((price) => Math.floor((discount * price) / subtotal));
  const byPrice = priceCents.map((_, index) => index).sort((a, b) => priceCents[b] - priceCents[a]);

  for (let rest = discount - sum(shares), k = 0; rest > 0; rest--, k = (k + 1) % byPrice.length) {
    shares[byPrice[k]] += 1;
  }

  return shares;
}
