import type { SellMobile } from "../mobile.types";

const img = (n: number) => `/images/lootora/sell-mobile-${String(n).padStart(2, "0")}.jpg`;

/** Mobile trade-up payload. Input value, ROI, gains and cashout totals are derived from it. */
export const sellMobile: SellMobile = {
  vault: { units: 84, valueUsd: 4289.5 },
  contract: {
    slots: 10,
    committed: [
      { id: "ak-redline", name: "AK-47", priceUsd: 46.8, image: img(1), imageAlt: "AK-47 Redline" },
      { id: "awp-wildfire", name: "Wildfire", priceUsd: 64.2, image: img(2), imageAlt: "AWP Wildfire" },
      { id: "m4a4-emperor", name: "Emperor", priceUsd: 58.4, image: img(3), imageAlt: "M4A4 The Emperor" },
      { id: "deagle-printstream", name: "Prntstrm", priceUsd: 54.1, image: img(4), imageAlt: "Desert Eagle Printstream" },
      { id: "usp-kill-confirmed", name: "Kill Conf", priceUsd: 71, image: img(5), imageAlt: "USP-S Kill Confirmed" },
      { id: "glock-water", name: "Water Elem", priceUsd: 22, image: img(6), imageAlt: "Glock-18 Water Elemental" },
      { id: "m4a1-hyper-beast", name: "HypBeast", priceUsd: 68, image: img(7), imageAlt: "M4A1-S Hyper Beast" },
    ],
    suggestions: [
      { id: "awp-asiimov-ft", name: "Asiimov", priceUsd: 52.3, image: img(12), imageAlt: "AWP Asiimov" },
      { id: "deagle-printstream-mw", name: "Prntstrm", priceUsd: 49.9, image: img(11), imageAlt: "Desert Eagle Printstream" },
      { id: "glock-high-beam", name: "High Beam", priceUsd: 18.4, image: img(10), imageAlt: "Glock-18 High Beam" },
    ],
    evUsd: 462.1,
    floatAvg: "0.1412 MW",
    seed: "Seed #09472",
    bot: "Escrow Bot #24",
    outcomes: [
      { id: "bfk-fade", name: "★ Butterfly Knife Fade", tier: "Tier 1 Target", verdict: "WIN", tone: "jackpot", chance: 18.4, valueUsd: 889, image: img(8), imageAlt: "Butterfly Knife Fade" },
      { id: "m4a1-player-two", name: "M4A1-S | Player Two", tier: "Tier 2 Mid", verdict: "GAIN", tone: "mid", chance: 34.6, valueUsd: 524, image: img(9), imageAlt: "M4A1-S Player Two" },
      { id: "glock-high-beam", name: "Glock-18 | High Beam", tier: "Tier 3 Risk", verdict: "DRAW", tone: "risk", chance: 47, valueUsd: 223, image: img(10), imageAlt: "Glock-18 High Beam" },
    ],
  },
  cashout: {
    rail: "USDT / Vault",
    arrival: "Est. arrival: 12 sec",
    rows: [
      { id: "deagle-printstream-fn", name: "Desert Eagle | Printstream", wear: "Factory New • 0.041", priceUsd: 142.5, image: img(11), imageAlt: "Desert Eagle Printstream", selected: true },
      { id: "awp-asiimov", name: "AWP | Asiimov", wear: "Field-Tested • 0.224", priceUsd: 186.3, image: img(12), imageAlt: "AWP Asiimov", selected: true },
      { id: "specialist-fade", name: "Specialist Gloves | Fade", wear: "Minimal Wear • 0.118", priceUsd: 284, image: img(13), imageAlt: "Specialist Gloves Fade", selected: true },
    ],
  },
};
