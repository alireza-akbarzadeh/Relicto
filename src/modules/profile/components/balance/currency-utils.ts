export type CurrencyMode = "usd" | "toman" | "coin";

export const TOMAN_EXCHANGE_RATE = 95_000;
export const TRX_EXCHANGE_RATE = 8.333;
export const R_COIN_EXCHANGE_RATE = 10;

/** Converts USD amount into formatted currency string. */
export function formatByCurrency(
  usdAmount: number,
  mode: CurrencyMode,
  options?: { compact?: boolean },
): { primary: string; secondary?: string; symbol: string } {
  if (mode === "toman") {
    const toman = Math.round(usdAmount * TOMAN_EXCHANGE_RATE);
    if (options?.compact && toman >= 1_000_000_000) {
      return {
        primary: `${(toman / 1_000_000_000).toFixed(2)}B`,
        secondary: "میلیارد تومان",
        symbol: "تومان",
      };
    }
    if (options?.compact && toman >= 1_000_000) {
      return {
        primary: `${(toman / 1_000_000).toFixed(1)}M`,
        secondary: "میلیون تومان",
        symbol: "تومان",
      };
    }
    return {
      primary: toman.toLocaleString("en-US"),
      secondary: "تومان",
      symbol: "TOMAN",
    };
  }

  if (mode === "coin") {
    const usdt = usdAmount.toFixed(2);
    const trx = Math.round(usdAmount * TRX_EXCHANGE_RATE).toLocaleString("en-US");
    const rCoins = Math.round(usdAmount * R_COIN_EXCHANGE_RATE).toLocaleString("en-US");

    return {
      primary: `${usdt} USDT`,
      secondary: `${trx} TRX · ${rCoins} R-Coins`,
      symbol: "USDT",
    };
  }

  // Default: USD
  return {
    primary: `$${usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    secondary: "USD Vault",
    symbol: "$",
  };
}

/** Formats delta percentage */
export function formatDelta(pct: number): { text: string; positive: boolean } {
  const positive = pct >= 0;
  return {
    text: `${positive ? "+" : ""}${pct.toFixed(1)}%`,
    positive,
  };
}
