"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { scrollToListings } from "../../lib/scroll";
import { useMarketplace } from "../../state/marketplace-provider";

/** The big command search: type, then Explore (or Enter) to filter the listings. */
export function HeroSearch() {
  const { filters, patch } = useMarketplace();
  const [draft, setDraft] = useState(filters.query);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    patch({ query: draft.trim() });
    scrollToListings();
  };

  const clear = () => {
    setDraft("");
    patch({ query: "" });
  };

  return (
    <form role="search" onSubmit={submit} className="group relative mb-space-md w-full max-w-4xl shadow-xl">
      <div className="relative flex items-center rounded-xl bg-surface-card p-space-xs transition-all duration-300">
        <Icon name="search" className="ml-space-md text-[24px] text-text-muted" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          type="text"
          enterKeyHint="search"
          aria-label="Search the marketplace"
          placeholder="Search skins, Arcanas, Doppler knives, stickers, heroes, or weapon slots..."
          className="w-full bg-transparent px-space-md py-3 font-body-lg text-body-lg text-text-primary placeholder:text-text-muted focus:outline-hidden"
        />
        {draft && (
          <button
            type="button"
            onClick={clear}
            title="Clear search"
            className="p-2 text-text-muted transition-colors hover:text-text-primary"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        )}
        <div className="mr-space-xs hidden items-center gap-1.5 rounded bg-surface-container px-2 py-1 font-label-badge text-label-badge text-text-secondary select-none sm:flex">
          <span>⌘</span>
          <span>K</span>
        </div>
        <button
          type="submit"
          className="flex items-center gap-space-xs rounded-lg bg-primary-container px-space-lg py-3 font-headline-sm text-headline-sm text-on-primary-container shadow-md transition-all hover:bg-primary active:scale-95"
        >
          <span>EXPLORE</span>
          <Icon name="arrow_forward" className="text-[18px]" />
        </button>
      </div>
    </form>
  );
}
