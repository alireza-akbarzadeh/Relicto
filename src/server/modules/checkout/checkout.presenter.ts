import type { IconName } from "@/components/ui/icon";
import type { CheckoutData, CheckoutItem } from "@/modules/checkout/types";
import { quote } from "@/modules/checkout/lib/pricing";
import { PAYMENT_RAILS, sessionCode } from "./checkout.rails";
import type { CartLine } from "./checkout.repository";
import { usd } from "../wallet/wallet.presenter";

const WEAR: Record<string, string> = { fn: "FN", mw: "MW", ft: "FT", ww: "WW", bs: "BS" };

/** Dota cosmetics have no exterior, so the wear slot carries the grade instead. */
const GRADE: Record<string, string> = { arcana: "ARC", immortal: "IMM", exalted: "EXA", persona: "PER" };

export function toCheckoutItem(row: CartLine): CheckoutItem {
  const { listing } = row;
  const p = listing.checkout;
  const market = listing.steamMarketCents;
  const wear = listing.wear ? WEAR[listing.wear] : row.rarity ? GRADE[row.rarity] : undefined;

  return {
    id: row.cartId,
    listingId: listing.id,
    slug: row.slug,
    // The seller's shot of this copy beats the catalog art.
    image: listing.imageUrl ?? row.imageUrl ?? "",
    imageAlt: listing.imageAlt ?? row.imageAlt ?? row.name,
    badge: p?.badge ?? "",
    badgeTone: p?.badgeTone ?? "",
    game: p?.game ?? "",
    gameTone: p?.gameTone ?? "",
    name: p?.name ?? row.name,
    ...(p?.subname ? { subname: p.subname } : {}),
    ...(p?.category ? { category: p.category } : {}),
    detail: p?.detail ?? "",
    intel: listing.intel ?? [],
    bot: listing.botName ?? "Relicto Sentinel",
    price: listing.priceCents / 100,
    ...(market !== null ? { marketPrice: market / 100 } : {}),
    // The saving is a fact about the two prices, so it is never stored.
    ...(market !== null && market > 0
      ? { discountPercentage: Math.round(((market - listing.priceCents) / market) * 100) }
      : {}),
    ...(wear ? { wear } : {}),
    ...(listing.float !== null ? { floatValue: listing.float } : {}),
    ...(listing.paintSeed !== null ? { paintSeed: listing.paintSeed } : {}),
    // A CS2 copy's marker is its grade and float, so it tracks the listing
    // rather than whatever was authored when the card was designed.
    marker: listing.wear && listing.float !== null ? `${WEAR[listing.wear]} ${listing.float}` : (p?.marker ?? ""),
    markerTone: p?.markerTone ?? "",
    ...(p?.icon ? { icon: p.icon as IconName } : {}),
  };
}

/** The screen's quote assumes the promo code is applied, as the panel does by default. */
export function toCheckoutData(rows: CartLine[], balanceCents: number): CheckoutData {
  const q = quote(
    rows.map((row) => row.listing.priceCents),
    true,
  );
  const remainingCents = balanceCents - q.dueCents;

  return {
    session: sessionCode(rows.map((row) => row.cartId)),
    items: rows.map(toCheckoutItem),
    paymentRails: PAYMENT_RAILS(balanceCents),
    subtotal: q.subtotalCents / 100,
    comboDiscount: q.comboCents / 100,
    promoDiscount: q.promoCents / 100,
    walletAfter: `${usd(Math.abs(remainingCents))} USD ${remainingCents >= 0 ? "Remaining" : "Short"}`,
  };
}
