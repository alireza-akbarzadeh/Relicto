import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const WIKI_TOPICS = [
  "All Universes",
  "CS2 Weapon Finishes",
  "Case Hardened Seeds",
  "CS2 Doppler Spectrum",
  "Dota 2 Arcanas & Personas",
  "Prismatic & Ethereal Gems",
] as const;

/** Wiki URL contract: search term and the selected universe. */
export const wikiSearchParams = {
  q: parseAsString.withDefault(""),
  topic: parseAsStringLiteral(WIKI_TOPICS).withDefault("All Universes"),
};

export const loadWikiSearchParams = createLoader(wikiSearchParams);
