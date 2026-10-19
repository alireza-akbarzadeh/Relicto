import type { EngineMod, ItemDetail } from "@/modules/items/types";
import type { ItemRow, ListingRow } from "./items.types";

const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function buildCatalogMods(item: ItemRow, itemListings: ListingRow[], gameLabel: string): ItemDetail["mods"] {
  const cheapest = itemListings[0];
  const isCs2 = item.gameId === "cs2";
  const items: EngineMod[] = [];

  if (isCs2) {
    const seed = cheapest?.paintSeed ?? (cheapest ? 661 : null);
    if (seed !== null) {
      items.push({
        id: "pattern-seed",
        icon: "gps_fixed",
        tone: "live",
        title: `Pattern Seed #${seed}`,
        body: `Source 2 procedural UV texture coordinate offset #${seed}. Determines blue gem coverage, wear distribution and surface positioning.`,
      });
    }

    const floatVal = cheapest?.float;
    const wearLabel = cheapest?.wear ? cheapest.wear.toUpperCase() : "FACTORY NEW";
    items.push({
      id: "float-wear",
      icon: "equalizer",
      tone: "cyan",
      title: floatVal !== null && floatVal !== undefined ? `Float Wear ${floatVal.toFixed(4)}` : `${wearLabel} Wear`,
      body: floatVal !== null && floatVal !== undefined
        ? `IEEE 754 precision floating point wear index within ${wearLabel} grade boundary.`
        : "Direct mechanical wear grading determining scratch density and paint integrity.",
    });

    items.push({
      id: "shader",
      icon: "palette",
      tone: "amber",
      title: `${(item.rarity ?? "Covert").toUpperCase()} Class Finish`,
      body: "Source 2 Physical-Based Rendering (PBR) shader matrix with multi-angle specular and normal reflection.",
    });

    items.push({
      id: "escrow",
      icon: "verified",
      tone: "indigo",
      title: "Zero-Hold Escrow Protocol",
      body: "Cryptographically verified Steam bot dispatch with instantaneous Relicto vault custody and settlement.",
    });
  } else {
    items.push({
      id: "particle-vfx",
      icon: "auto_awesome",
      tone: "live",
      title: "Custom Particle & Ambient FX",
      body: "Custom in-engine particle telemetry, sound modifications, and custom loadout ambient lighting.",
    });

    items.push({
      id: "socket-matrix",
      icon: "flare",
      tone: "cyan",
      title: "Prismatic & Inscribed Sockets",
      body: "Supports Artificer's Chisel socket extraction, custom Inscribed stat gems, and Prismatic RGB hue modulation.",
    });

    items.push({
      id: "slot",
      icon: "military_tech",
      tone: "amber",
      title: `${(item.rarity ?? "Immortal").toUpperCase()} Tier Cosmetic`,
      body: `Equippable on hero ${item.heroName ?? "All Heroes"} in the ${item.slot ?? "Signature"} equipment slot.`,
    });

    items.push({
      id: "escrow",
      icon: "verified",
      tone: "indigo",
      title: "Relicto Automated Dispatch",
      body: "Instant peer escrow verification with multi-sig smart buyer protection.",
    });
  }

  return {
    eyebrow: isCs2 ? "CS2 SOURCE 2 ENGINE SPEC" : "HERO ATTRIBUTES & CUSTOM METRICS",
    title: isCs2 ? "Counter-Strike 2 Weapon Telemetry" : "Dota 2 Engine Modifications",
    items,
    lore: {
      quote: item.description || `Forged in the competitive history of ${gameLabel}. A distinguished cosmetic asset commanding verified standing across trading guilds.`,
      source: `Valve Corporation · ${gameLabel} Schema Registry`,
      verified: "Official Verified Valve Asset",
    },
  };
}

export function buildCatalogReplay(item: ItemRow, lowestCents: number): ItemDetail["replay"] {
  return {
    eyebrow: "60 FPS IN-ENGINE REPLAY",
    quality: "Source 2 High-Precision Render",
    title: `${item.name} — Visual & Audio Telemetry`,
    image: item.imageUrl ?? "",
    imageAlt: item.imageAlt ?? item.name,
    caption: "Real-time physical asset inspection under dynamic map illumination and ambient reflection.",
    damage: "100% Mint Condition",
    alertPrice: money(lowestCents),
  };
}
