"use client";

import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { optimisticLine } from "@/modules/checkout/lib/optimistic-line";
import { useCart } from "@/modules/relicto/state/cart-provider";
import type { SearchItem, SearchResults } from "../types";
import { useRecentSearches } from "./use-recent-searches";
import {
  EMPTY_CRITERIA,
  useSearchResults,
  type SearchCriteria,
} from "./use-search-results";

const GAME_LABEL = { cs2: "CS2", dota2: "Dota 2", tf2: "TF2" } as const;

/**
 * The command palette's state and keys: criteria, the highlighted result,
 * ↑↓ to move, Enter to open, Tab to basket the copy. Esc belongs to the dialog.
 * The body is remounted per opening, so criteria start from the header's text.
 */
export function useSearchPalette(initialQuery: string, onClose: () => void) {
  const router = useRouter();
  const { has, addItem } = useCart();
  const recents = useRecentSearches();
  const [criteria, setCriteria] = useState<SearchCriteria>({
    ...EMPTY_CRITERIA,
    q: initialQuery,
  });
  const { results, loading, failed } = useSearchResults(criteria, true);
  const items = results?.items ?? [];

  // The highlight belongs to one answer: a new answer starts back at the top.
  const [selection, setSelection] = useState<{
    answer: SearchResults | null;
    index: number;
  }>({ answer: null, index: 0 });
  const active = selection.answer === results ? selection.index : 0;
  const setActive = (index: number) => setSelection({ answer: results, index });

  const update = (patch: Partial<SearchCriteria>) =>
    setCriteria((current) => ({ ...current, ...patch }));

  const openItem = (item: SearchItem) => {
    recents.remember(criteria.q || item.name);
    onClose();
    router.push(`/items/${item.slug}`);
  };

  const basket = (item: SearchItem) => {
    if (has(item.listingId) || has(item.slug))
      return toast(`${item.name} is already in your basket`);
    recents.remember(criteria.q || item.name);
    void addItem(
      optimisticLine({
        slug: item.slug,
        name: item.name,
        image: item.image,
        imageAlt: item.imageAlt,
        gameLabel: GAME_LABEL[item.game],
        rarityLabel: item.chips.at(-1),
        priceUsd: item.floorUsd,
        listingId: item.listingId,
        ...(item.floatValue !== null ? { floatValue: item.floatValue } : {}),
      }),
      item.listingId,
    );
    toast.success(`${item.name} added to your basket`, {
      description: `${formatMoney(item.floorUsd)} reserved for escrow checkout.`,
      action: { label: "Checkout", onClick: () => router.push("/checkout") },
    });
  };

  /** Enter with nothing highlighted searches the full marketplace. */
  const searchMarketplace = () => {
    recents.remember(criteria.q);
    onClose();
    router.push(
      criteria.q.trim()
        ? `/marketplace?q=${encodeURIComponent(criteria.q.trim())}`
        : "/marketplace",
    );
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (items.length)
        setActive(
          (active + (event.key === "ArrowDown" ? 1 : items.length - 1)) %
            items.length,
        );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (items[active]) openItem(items[active]);
      else searchMarketplace();
    } else if (event.key === "Tab" && items[active]) {
      event.preventDefault();
      basket(items[active]);
    }
  };

  return {
    criteria,
    update,
    results,
    loading,
    failed,
    items,
    active,
    setActive,
    openItem,
    basket,
    searchMarketplace,
    onKeyDown,
    recents,
  };
}
