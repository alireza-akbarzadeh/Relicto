/** Data contracts of the mobile trade-up studio (Stitch: "Lootora Mobile — Inventory Liquidation & Trade-Up"). */

export type ContractItem = { id: string; name: string; priceUsd: number; image: string; imageAlt: string };

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

export type SellMobile = {
  vault: { units: number; valueUsd: number };
  contract: {
    slots: number;
    committed: ContractItem[];
    suggestions: ContractItem[];
    evUsd: number;
    floatAvg: string;
    seed: string;
    bot: string;
    outcomes: Outcome[];
  };
  cashout: { rows: CashoutRow[]; rail: string; arrival: string };
};
