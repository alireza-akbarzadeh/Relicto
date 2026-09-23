/** Data contracts of the mobile trade-up studio (Stitch: "Lootora Mobile — Inventory Liquidation & Trade-Up"). */

/** A skin that can sit in a contract slot. `rarity` locks the contract: every input shares one grade. */
export type ContractItem = {
  id: string;
  name: string;
  priceUsd: number;
  image: string;
  imageAlt: string;
  rarity: string;
  float: number | null;
};

export type Outcome = {
  id: string;
  name: string;
  tier: string;
  verdict: string;
  tone: "jackpot" | "mid" | "risk";
  chance: number;
  valueUsd: number;
  image: string;
  imageAlt: string;
};

export type CashoutRow = { id: string; name: string; wear: string; priceUsd: number; image: string; imageAlt: string; selected: boolean };

export type TradeUpContract = {
  slots: number;
  /** Slot-indexed: a gap is an empty slot. */
  committed: (ContractItem | null)[];
  /** Eligible skins not yet committed, in the order Smart Fill takes them. */
  suggestions: ContractItem[];
  evUsd: number;
  seed: string;
  bot: string;
  outcomes: Outcome[];
};

export type SellMobile = {
  vault: { units: number; valueUsd: number };
  contract: TradeUpContract;
  cashout: { rows: CashoutRow[]; rail: string; arrival: string };
};
