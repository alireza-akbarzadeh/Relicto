import "server-only";

import { toListingView } from "./listings.presenter";
import * as repository from "./listings.repository";
import { createListingInput, listListingsInput, type CreateListingInput, type ListListingsInput } from "./listings.schema";

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
