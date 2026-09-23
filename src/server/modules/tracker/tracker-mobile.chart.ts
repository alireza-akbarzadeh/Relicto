import type { Candle, TrackerMobileData } from "@/modules/tracker/mobile.types";

/** Geometry of the mobile spot chart: ten candles across a 320×110 viewBox. */
const CANDLES = 10;
const FIRST_X = 20;
const STEP_X = 30;
const HEIGHT = 110;
const PAD = 8;
/** Four-candle EMA — short enough to hug price on a ten-candle chart. */
const EMA_ALPHA = 2 / (4 + 1);

type Ohlc = { open: number; high: number; low: number; close: number };

const round = (value: number) => Math.round(value * 10) / 10;
const dollars = (cents: number) => Math.round(cents / 100);

/** Splits the series into ten buckets; each opens where the last one closed. */
function toOhlc(series: number[]): Ohlc[] {
  const size = Math.ceil(series.length / CANDLES);
  const buckets = Array.from({ length: CANDLES }, (_, i) => series.slice(i * size, (i + 1) * size)).filter((b) => b.length);

  return buckets.map((bucket, i) => {
    const open = i === 0 ? bucket[0] : buckets[i - 1][buckets[i - 1].length - 1];
    return { open, high: Math.max(open, ...bucket), low: Math.min(open, ...bucket), close: bucket[bucket.length - 1] };
  });
}

/**
 * Candles, EMA line and range labels from the item's real price history.
 * Volume isn't recorded yet, so its bars keep the authored heights and only
 * take their colour from the candle above them.
 */
export function toCandleChart(
  series: number[],
  authored: TrackerMobileData["chart"],
): TrackerMobileData["chart"] {
  if (series.length < 2) return authored;

  const ohlc = toOhlc(series);
  const high = Math.max(...ohlc.map((c) => c.high));
  const low = Math.min(...ohlc.map((c) => c.low));
  const span = high - low || 1;
  const y = (cents: number) => round(PAD + ((high - cents) / span) * (HEIGHT - 2 * PAD));

  const candles: Candle[] = ohlc.map((c, i) => {
    const top = y(Math.max(c.open, c.close));
    return {
      x: FIRST_X + i * STEP_X,
      wick: [y(c.high), y(c.low)],
      body: [top, Math.max(2, round(Math.abs(y(c.open) - y(c.close))))],
      tone: i === ohlc.length - 1 ? "now" : c.close >= c.open ? "up" : "down",
    };
  });

  let ema = ohlc[0].close;
  const emaPoints = ohlc.map((c, i) => {
    ema = i === 0 ? c.close : EMA_ALPHA * c.close + (1 - EMA_ALPHA) * ema;
    return `${FIRST_X + i * STEP_X},${y(ema)}`;
  });

  return {
    high: dollars(high),
    low: dollars(low),
    ema: `$${dollars(ema).toLocaleString("en-US")}`,
    emaPath: `M ${emaPoints.join(" L ")}`,
    candles,
    volume: authored.volume.map((bar, i) => ({
      ...bar,
      tone: candles[i]?.tone === "now" ? "now" : candles[i]?.tone === "down" ? "down" : "up",
    })),
  };
}
