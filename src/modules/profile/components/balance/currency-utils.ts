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

/** Builds smooth cubic bezier SVG path across points. */
export function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const dx = (p1.x - p0.x) * 0.5;
    d += ` C ${(p0.x + dx).toFixed(1)} ${p0.y.toFixed(1)}, ${(p1.x - dx).toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}
