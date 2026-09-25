import "server-only";

import type { Tone, WatchedItem } from "@/modules/profile/types";
import { ago } from "../shared/ago";
import type { WatchedRow } from "./watchlist.repository";

const GAME_LABEL: Record<string, string> = { dota2: "Dota 2", cs2: "CS2", tf2: "TF2" };

const RARITY_LABEL: Record<string, string> = {
  arcana: "Arcana",
  exalted: "Exalted",
  immortal: "Immortal",
  ancient: "Ancient",
  mythical: "Mythical",
  rare: "Rare",
  persona: "Persona",
  covert: "Covert",
  melee: "★ Melee",
  gloves: "★ Gloves",
};

/** Grades carry the card's accent, so the rail reads like the marketplace. */
const RARITY_TONE: Record<string, Tone> = {
  arcana: "crimson",
  immortal: "amber",
  ancient: "amber",
  mythical: "indigo",
  rare: "cyan",
  covert: "crimson",
  melee: "indigo",
  gloves: "amber",
};

const TONES = new Set<Tone>(["crimson", "amber", "indigo", "cyan", "white", "muted", "live"]);

export function toWatchedItem(row: WatchedRow): WatchedItem {
  const rarity = row.rarity ?? "";
  /* The board row's own tone wins when the trader set one; else the grade's. */
  const stored = TONES.has(row.tone as Tone) ? (row.tone as Tone) : null;

  return {
    slug: row.slug,
    name: row.label ?? row.name,
    subtitle: row.detail ?? row.presentation?.subtitle ?? GAME_LABEL[row.gameId] ?? row.gameId,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    gameLabel: GAME_LABEL[row.gameId] ?? row.gameId,
    rarityLabel: RARITY_LABEL[rarity] ?? rarity,
    tone: stored ?? RARITY_TONE[rarity] ?? "muted",
    floorUsd: row.floorCents === null ? null : Number(row.floorCents) / 100,
    changePercent: row.changePercent,
    listingId: row.listingId,
    sellerCount: row.offerCount,
    watchedAgo: ago(row.watchedAt),
  };
}
