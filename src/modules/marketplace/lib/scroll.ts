export const LISTINGS_ANCHOR = "listings";

/** Bring the results into view below the fixed header after a search. */
export function scrollToListings() {
  document.getElementById(LISTINGS_ANCHOR)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
