import type { CheckoutItem } from "../types";

/** Dota cosmetics have no exterior, so the wear chip carries the grade instead. */
const GRADE_CHIP: Record<string, string> = {
  Arcana: "ARC",
  Immortal: "IMM",
  Exalted: "EXA",
  Ancient: "ANC",
  Mythical: "MYT",
  Persona: "PER",
};

export type OptimisticLineInput = {
  /** Item slug — also the optimistic row's id until the server answers. */
  slug: string;
  name: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  /** Display label, e.g. "Dota 2" / "CS2". */
  gameLabel: string;
  /** Display label, e.g. "Arcana" / "★ Melee". */
  rarityLabel?: string;
  priceUsd: number;
  /** The exact copy being reserved, when one is known. */
  listingId?: string | null;
  wear?: string;
  floatValue?: number;
  paintSeed?: number;
};

/**
 * A basket line built from what a screen actually knows about an item, shown
 * while the server reserves the copy — `useCartState` replaces it with the
 * server's row the moment the action answers.
 *
 * Every buy button goes through this. Building the line inline is how the item
 * page ended up stamping "Arcana / Dota 2 / Phantom Assassin Weapon Artifact"
 * onto every item added from it.
 *
 * Tones are left empty, matching what the server returns for any listing
 * without authored checkout art direction.
 */
export function optimisticLine(input: OptimisticLineInput): CheckoutItem {
  const chip = input.wear ?? (input.rarityLabel ? GRADE_CHIP[input.rarityLabel] : undefined);

  return {
    id: input.slug,
    ...(input.listingId ? { listingId: input.listingId } : {}),
    slug: input.slug,
    image: input.image,
    imageAlt: input.imageAlt ?? input.name,
    badge: input.rarityLabel ?? "",
    badgeTone: "",
    game: input.gameLabel,
    gameTone: "",
    name: input.name,
    detail: input.subtitle ?? "",
    intel: [],
    bot: "Relicto Sentinel",
    price: input.priceUsd,
    ...(chip ? { wear: chip } : {}),
    ...(input.floatValue !== undefined ? { floatValue: input.floatValue } : {}),
    ...(input.paintSeed !== undefined ? { paintSeed: input.paintSeed } : {}),
    marker: input.wear && input.floatValue !== undefined ? `${input.wear} ${input.floatValue}` : "",
    markerTone: "",
  };
}
