import type { CatalogSeedItem } from "./catalog.types";

/**
 * Authentic game asset resolver for Relicto catalog depth.
 * Maps CS2 knives, gloves, rifles, sidearms, Dota 2 arcanas, heroes and slots,
 * and TF2 loadouts to distinct high-fidelity game photography.
 */
export function resolveArtwork(item: CatalogSeedItem): string {
  const slug = item.slug.toLowerCase();

  // 1. Counter-Strike 2 Weaponry & Gear
  if (item.gameId === "cs2") {
    // Knives / Melee
    if (slug.includes("karambit")) return "/images/lootora/items/karambit-doppler.jpg";
    if (slug.includes("butterfly-fade") || (slug.includes("fade") && item.rarity === "melee")) {
      return "/images/lootora/sell-mobile-08.jpg";
    }
    if (slug.includes("butterfly")) return "/images/lootora/items/butterfly-doppler.jpg";
    if (slug.includes("talon")) return "/images/lootora/sell-items-07.jpg";
    if (slug.includes("skeleton")) return "/images/lootora/sell-items-04.jpg";
    if (slug.includes("m9") || slug.includes("bayonet")) {
      return slug.includes("crimson") ? "/images/lootora/sell-items-09.jpg" : "/images/lootora/sell-items-07.jpg";
    }
    if (slug.includes("flip") || slug.includes("huntsman") || item.rarity === "melee") {
      return "/images/lootora/items/butterfly-doppler.jpg";
    }

    // Gloves
    if (slug.includes("specialist-fade") || (slug.includes("specialist") && slug.includes("fade"))) {
      return "/images/lootora/sell-mobile-13.jpg";
    }
    if (slug.includes("specialist")) return "/images/lootora/sell-items-09.jpg";
    if (slug.includes("vice")) return "/images/lootora/sell-items-03.jpg";
    if (slug.includes("glove") || item.slot === "Gloves" || item.rarity === "gloves") {
      return "/images/lootora/items/sport-gloves-vice.jpg";
    }

    // Rifles - AK-47
    if (slug.includes("ak-redline") || slug.includes("redline")) return "/images/lootora/sell-mobile-01.jpg";
    if (slug.includes("fire-serpent")) return "/images/lootora/market-mobile-04.jpg";
    if (slug.includes("vulcan") || slug.includes("bloodsport") || slug.includes("neon-rider")) {
      return "/images/lootora/items/ak47-vulcan.jpg";
    }
    if (slug.includes("case-hardened") || slug.includes("slate") || slug.includes("ak-")) {
      return "/images/lootora/sell-items-04.jpg";
    }

    // Rifles - M4
    if (slug.includes("howl")) return "/images/lootora/market-mobile-06.jpg";
    if (slug.includes("the-emperor") || slug.includes("emperor")) return "/images/lootora/sell-mobile-03.jpg";
    if (slug.includes("hyper-beast") && (slug.includes("m4") || slug.includes("m4a1"))) {
      return "/images/lootora/sell-mobile-07.jpg";
    }
    if (slug.includes("player-two")) return "/images/lootora/sell-mobile-09.jpg";
    if (slug.includes("m4a1") || slug.includes("m4a4")) return "/images/lootora/sell-items-06.jpg";

    // Snipers - AWP & SSG
    if (slug.includes("dragon-lore")) return "/images/lootora/sell-items-02.jpg";
    if (slug.includes("wildfire")) return "/images/lootora/sell-mobile-02.jpg";
    if (slug.includes("awp-asiimov") || slug.includes("asiimov")) return "/images/lootora/sell-mobile-12.jpg";
    if (slug.includes("awp") || slug.includes("fade")) return "/images/lootora/items/awp-fade.jpg";
    if (slug.includes("ssg") || slug.includes("blood-in-the-water") || slug.includes("dragonfire")) {
      return "/images/lootora/sell-mobile-02.jpg";
    }

    // Pistols
    if (slug.includes("kill-confirmed") || slug.includes("usps") || slug.includes("usp-")) {
      return "/images/lootora/sell-mobile-05.jpg";
    }
    if (slug.includes("water-elemental")) return "/images/lootora/sell-mobile-06.jpg";
    if (slug.includes("high-beam")) return "/images/lootora/sell-mobile-10.jpg";
    if (slug.includes("glock")) return "/images/lootora/sell-mobile-06.jpg";
    if (slug.includes("printstream")) return "/images/lootora/items/deagle-printstream.jpg";
    if (slug.includes("deagle") || slug.includes("desert") || slug.includes("fennec")) {
      return "/images/lootora/sell-items-08.jpg";
    }
    if (slug.includes("p250") || slug.includes("fiveseven")) {
      return "/images/lootora/sell-mobile-04.jpg";
    }

    // SMGs, Heavy, and Other Rifles
    if (slug.includes("galil") || slug.includes("famas")) return "/images/lootora/sell-mobile-01.jpg";
    if (slug.includes("sg553") || slug.includes("aug")) return "/images/lootora/sell-items-06.jpg";
    if (slug.includes("mac10") || slug.includes("mp9") || slug.includes("ump45") || slug.includes("p90")) {
      return "/images/lootora/sell-items-06.jpg";
    }
    if (slug.includes("nova") || slug.includes("xm1014") || slug.includes("negev")) {
      return "/images/lootora/sell-items-04.jpg";
    }

    return "/images/lootora/sell-items-04.jpg";
  }

  // 2. Dota 2 Arcanas, Immortals & Heroes
  if (item.gameId === "dota2") {
    // Pudge
    if (item.hero === "Pudge" || slug.includes("pudge")) {
      if (slug.includes("abscession") || item.rarity === "arcana") {
        return "/images/lootora/items/pudge-feast-abscession.jpg";
      }
      return "/images/lootora/items/dragonclaw-hook.jpg";
    }

    // Crystal Maiden
    if (item.hero === "Crystal Maiden" || slug.includes("crystal-maiden") || slug.includes("frost-avalanche")) {
      return "/images/lootora/items/crystal-maiden-frost-avalanche.jpg";
    }

    // Phantom Assassin
    if (item.hero === "Phantom Assassin" || slug.includes("phantom-assassin")) {
      if (slug.includes("asan")) return "/images/lootora/item-mobile-02.jpg";
      if (slug.includes("codicil")) return "/images/lootora/items/codicil-veiled.jpg";
      if (slug.includes("gothic")) return "/images/lootora/item-mobile-04.jpg";
      return "/images/lootora/items/manifold-paradox.jpg";
    }

    // Juggernaut
    if (item.hero === "Juggernaut" || slug.includes("juggernaut") || slug.includes("bladeform")) {
      return "/images/lootora/items/bladeform-legacy.jpg";
    }

    // Invoker
    if (item.hero === "Invoker" || slug.includes("invoker") || slug.includes("dark-artistry")) {
      return "/images/lootora/items/dark-artistry-cape.jpg";
    }

    // By Equipment Slot
    if (item.slot === "Head") return "/images/lootora/items/codicil-veiled.jpg";
    if (item.slot === "Armor") return "/images/lootora/item-mobile-04.jpg";
    if (item.slot === "Weapon") {
      return item.rarity === "immortal"
        ? "/images/lootora/items/bladeform-legacy.jpg"
        : "/images/lootora/items/manifold-paradox.jpg";
    }
    if (item.slot === "Couriers") return "/images/lootora/items/thumb-asan-exile.jpg";
    if (item.slot === "Back" || item.slot === "Taunts") return "/images/lootora/items/dark-artistry-cape.jpg";

    return "/images/lootora/items/dark-artistry-cape.jpg";
  }

  // 3. Team Fortress 2 Arsenal & Cosmetics
  if (item.gameId === "tf2") {
    if (
      slug.includes("rocket") ||
      slug.includes("scattergun") ||
      slug.includes("sniper") ||
      slug.includes("minigun") ||
      slug.includes("medi-gun") ||
      slug.includes("flame")
    ) {
      return "/images/lootora/items/tf2-australium-rocket.jpg";
    }
    if (slug.includes("knife") || slug.includes("eyelander") || item.slot === "Weapon") {
      return "/images/lootora/sell-items-01.jpg";
    }
    if (item.slot === "Head") return "/images/lootora/items/codicil-veiled.jpg";
    if (item.slot === "Armor") return "/images/lootora/item-mobile-04.jpg";
    if (item.slot === "Taunts") return "/images/lootora/item-mobile-02.jpg";
    if (item.slot === "Couriers") return "/images/lootora/items/thumb-asan-exile.jpg";

    return "/images/lootora/items/tf2-australium-rocket.jpg";
  }

  return "/images/lootora/items/dark-artistry-cape.jpg";
}
