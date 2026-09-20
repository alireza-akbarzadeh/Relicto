import type { IconName } from "@/components/ui/icon";

export type SellGame = "cs2" | "dota2" | "tf2";
export type SellTone = "primary" | "amber" | "cyan" | "indigo" | "muted";

export type InventoryItem = {
  id: string;
  game: SellGame;
  image: string;
  imageAlt: string;
  marker: string;
  name: string;
  rarity: string;
  wear: string;
  float: string;
  rank?: string;
  price: number;
  floor: number;
  delta: string;
  deltaTone: SellTone;
  wearPct: number;
  tone: SellTone;
};

export type ActiveListing = {
  id: string;
  image: string;
  imageAlt: string;
  name: string;
  price: string;
  floorDelta: string;
  buyerViews: string;
  offers: string;
  age: string;
  tone: SellTone;
};

export type SellData = {
  inventory: InventoryItem[];
  activeListings: ActiveListing[];
  gameCounts: Record<SellGame, number>;
  totalInventory: number;
  readyToList: number;
};

export type SellRail = { id: string; label: string; icon: IconName };
