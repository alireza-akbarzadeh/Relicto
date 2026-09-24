import "server-only";

import type { Filters } from "@/modules/marketplace/types";
import { countFacets } from "./listings.facets";
import { toMobileFeed } from "./listings-mobile.presenter";
import { toListingView } from "./listings.presenter";
import * as repository from "./listings.repository";
import { createListingInput, listListingsInput, type CreateListingInput, type ListListingsInput } from "./listings.schema";
import { toListingQuery } from "./listings.search";

/**
 * Transport-agnostic. Server Components import this directly; Server Actions
 * and (later) an RPC router wrap it — none of that leaks in here.
 */
export const listingService = {
  async list(rawInput: Partial<ListListingsInput> = {}) {
    const input = listListingsInput.parse(rawInput);
    const { rows, total } = await repository.findListings(input);

    return {
      listings: rows,
      total,
      page: input.page,
      perPage: input.perPage,
      pages: Math.max(1, Math.ceil(total / input.perPage)),
    };
  },

  /** The marketplace catalog, shaped as the UI's `Listing[]` contract. */
  async catalog(rawInput: Partial<ListListingsInput> = {}) {
    const input = listListingsInput.parse({ perPage: 96, ...rawInput });
    const { rows } = await repository.findListings(input);
    return rows.map(toListingView);
  },

  /**
   * One page of the marketplace grid plus the tallies around it — the numbers
   * the toolbar, the pagination bar and the sidebar all quote.
   */
  async search(filters: Filters) {
    const input = listListingsInput.parse(toListingQuery(filters));
    const [{ rows, total }, facets] = await Promise.all([
      repository.findListings(input),
      countFacets(input.gameId),
    ]);

    const pages = Math.max(1, Math.ceil(total / input.perPage));
    const from = rows.length ? (input.page - 1) * input.perPage + 1 : 0;

    return {
      items: rows.map(toListingView),
      total,
      pages,
      from,
      to: from ? from + rows.length - 1 : 0,
      facets,
    };
  },

  /** The mobile trading feed (one card per item, biggest movers first) and the liquidity its ticker quotes. */
  async mobileFeed(userId: string) {
    const [catalog, watched, liquidityCents] = await Promise.all([
      listingService.catalog({ sort: "recent" }),
      repository.findWatchedSlugs(userId),
      repository.sumActiveLiquidityCents(),
    ]);
    return { listings: toMobileFeed(catalog, watched), liquidityUsd: liquidityCents / 100 };
  },

  /** Live market figures the hub quotes (liquidity, per-item floors). */
  async marketStats(floorSlugs: string[] = []) {
    const [liquidityCents, floorsBySlug] = await Promise.all([
      repository.sumActiveLiquidityCents(),
      repository.findFloorCentsBySlug(floorSlugs),
    ]);

    return { liquidityUsd: liquidityCents / 100, floorsBySlug };
  },

  async byId(id: string) {
    return repository.findListingById(id);
  },

  async create(sellerId: string, rawInput: CreateListingInput) {
    const input = createListingInput.parse(rawInput);
    return repository.insertListing(sellerId, input);
  },

  /** Returns null when the listing was already sold or cancelled. */
  async markSold(id: string) {
    return repository.markListingSold(id);
  },
};
