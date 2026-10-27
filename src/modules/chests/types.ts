import type { IconName } from "@/components/ui/icon";

export type ChestRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "mythical"
  | "legendary"
  | "immortal"
  | "arcana"
  | "cosmic"
  | "covert";

export type ChestTier =
  | "beginner"
  | "vanguard"
  | "elite"
  | "master"
  | "divine"
  | "legendary";

export type EscalatingTier = "rare" | "very_rare" | "ultra_rare" | "cosmic";

export type ChestSkinItem = {
  id: string;
  name: string;
  hero?: string;
  gameId: "dota2" | "cs2";
  rarity: ChestRarity;
  imageUrl: string;
  valueUsd: number;
  baseOddsPct: number;
  isEscalatingBonus?: boolean;
  escalatingTier?: EscalatingTier;
  slot?: string;
  tone: string;
};

export type ChestDefinition = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  tier: ChestTier;
  rankBadge: string;
  priceCoins: number;
  priceUsd: number;
  items: ChestSkinItem[];
  isActive: boolean;
  openCount: number;
  featured?: boolean;
  hasEscalatingOdds: boolean;
  colorAccent: string;
};

export type EscalatingOddsState = {
  streak: number;
  currentOddsPct: number;
  baseOddsPct: number;
  tier: EscalatingTier;
  label: string;
};

export type UnboxResult = {
  id: string;
  chestId: string;
  wonItem: ChestSkinItem;
  bonusItem?: ChestSkinItem | null;
  rollSeed: string;
  rollHash: string;
  escalatingStreak: number;
  timestamp: string;
  reelItems: ChestSkinItem[];
  winningIndex: number;
  recycleCoinsValue: number;
};

export type CoinPackage = {
  id: string;
  coins: number;
  bonusCoins: number;
  priceUsd: number;
  priceToman: number;
  popular?: boolean;
  badge?: string;
};

export const COIN_PACKAGES: CoinPackage[] = [
  { id: "pkg-1", coins: 500, bonusCoins: 50, priceUsd: 5.0, priceToman: 475_000, badge: "STARTER" },
  { id: "pkg-2", coins: 1200, bonusCoins: 180, priceUsd: 12.0, priceToman: 1_140_000, popular: true, badge: "+15% BONUS" },
  { id: "pkg-3", coins: 3500, bonusCoins: 700, priceUsd: 35.0, priceToman: 3_325_000, badge: "+20% BONUS" },
  { id: "pkg-4", coins: 10000, bonusCoins: 2500, priceUsd: 100.0, priceToman: 9_500_000, badge: "HIGH ROLLER (+25%)" },
];

export type CurrencyConversion = {
  coinRatePerUsd: number;
  tomanRatePerUsd: number;
  coinRateToman: number;
};

export type LiveDropItem = {
  id: string;
  traderHandle: string;
  traderAvatar: string;
  chestName: string;
  chestSlug: string;
  item: ChestSkinItem;
  timeAgo: string;
};

export type DailyBonusState = {
  canClaim: boolean;
  currentStreak: number;
  bonusCoins: number;
  nextBonusCoins: number;
  timeUntilNextClaimSec: number;
};

export type PaymentMethodOption = "coins" | "cash_usd" | "cash_toman" | "combination";
