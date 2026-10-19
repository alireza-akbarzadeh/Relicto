import type { ItemDetail } from "../types";

export type MediaImage = {
  url: string;
  title: string;
  caption: string;
};

export type VideoMarker = {
  time: number;
  label: string;
};

export type ItemMediaData = {
  slug: string;
  name: string;
  hero: string;
  game: string;
  rarity: string;
  video: {
    url: string;
    title: string;
    fps: string;
    resolution: string;
    duration: string;
    source: string;
    description: string;
    markers: VideoMarker[];
  };
  gallery: MediaImage[];
  sfx: {
    title: string;
    frequency: string;
    description: string;
  };
};

const AUTHORED_MEDIA: Record<string, Partial<ItemMediaData>> = {
  "dark-artistry-bracers": {
    slug: "dark-artistry-bracers",
    name: "Dark Artistry Bracers",
    hero: "Invoker",
    game: "Dota 2",
    rarity: "Immortal",
    video: {
      url: "/media/items/dark-artistry-bracers.webm",
      title: "Sun Strike & Deafening Blast VFX In-Game",
      fps: "60 FPS",
      resolution: "1080p",
      duration: "0:14",
      source: "Sotoon Storage / Local Asset Node",
      description: "Signature Dark Artistry particles: orbital flame ignition, custom rune trails, and Deafening Blast kinetic ripples.",
      markers: [
        { time: 0, label: "Orbital Flame Stance" },
        { time: 4, label: "Sun Strike Orbital Cast" },
        { time: 9, label: "Deafening Blast Blastwave" },
      ],
    },
    gallery: [
      {
        url: "/images/lootora/items/dark-artistry-cape.jpg",
        title: "High-Poly Relic Model",
        caption: "Dark Artistry woven velvet with gold filigree and floating occult sigils.",
      },
      {
        url: "/images/lootora/item-detail-01.jpg",
        title: "Arcana Synergy Loadout",
        caption: "Equipped in combination with Magus Apex and celestial pauldrons.",
      },
      {
        url: "/images/lootora/item-detail-03.jpg",
        title: "Runic Texture Close-Up",
        caption: "Detailed view of the illuminated glyphs engraved into the arm braces.",
      },
      {
        url: "/images/lootora/item-detail-04.jpg",
        title: "In-Game Teamfight Action",
        caption: "Tournament spectator camera capturing active spell dispersion.",
      },
      {
        url: "/images/lootora/item-detail-05.jpg",
        title: "Rear Silhouette & Mantle",
        caption: "Rear cape drape and ambient particle emission in combat stance.",
      },
    ],
    sfx: {
      title: "Resonant Astral Casting",
      frequency: "96 kHz / 24-bit",
      description: "Altered bass shockwave on Deafening Blast and high-frequency chime on Sun Strike.",
    },
  },
};

/**
 * Returns authored showcase media or dynamically synthesizes media for any catalog item.
 */
export function getItemMedia(item: ItemDetail): ItemMediaData {
  const authored = AUTHORED_MEDIA[item.slug];
  if (authored && authored.video && authored.gallery) {
    return authored as ItemMediaData;
  }

  const primaryImage = item.hero.image || "/images/lootora/items/dark-artistry-cape.jpg";
  const rarityBadge = item.badges[0]?.label ?? "Collectible";

  return {
    slug: item.slug,
    name: item.name,
    hero: item.eyebrow.hero || "Hero",
    game: item.eyebrow.game || "Steam Ecosystem",
    rarity: rarityBadge,
    video: {
      url: "/media/items/dark-artistry-bracers.webm",
      title: `${item.name} In-Game Inspection & Kinetic VFX`,
      fps: "60 FPS Live",
      resolution: "1080p",
      duration: "0:14",
      source: "Sotoon Cloud Vault",
      description: `Official in-game inspect and battle animation telemetry for ${item.name}.`,
      markers: [
        { time: 0, label: "Draw & Ready Pose" },
        { time: 5, label: "Kinetic Effect Active" },
        { time: 10, label: "Holster & Idle Stance" },
      ],
    },
    gallery: [
      {
        url: primaryImage,
        title: "Primary Hero Art",
        caption: `Standard inspection render of ${item.name} authenticated by Steam bot network.`,
      },
      {
        url: "/images/lootora/item-detail-02.jpg",
        title: "Tournament Loadout",
        caption: "Equipped in professional competitive match environment.",
      },
      {
        url: "/images/lootora/item-detail-03.jpg",
        title: "Texture Surface & Shader Depth",
        caption: "High-resolution specular highlights and micro-wear detail.",
      },
      {
        url: "/images/lootora/item-detail-06.jpg",
        title: "Alternate Lighting Angle",
        caption: "Ambient directional lighting test in standard game engine view.",
      },
    ],
    sfx: {
      title: "Signature Audio Trigger",
      frequency: "48 kHz Stereo",
      description: "Synchronized sound effect emitted on item draw, spell execution, or hit confirmation.",
    },
  };
}
