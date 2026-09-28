import type { PriceAlert } from "@/modules/alerts/types";
import type { MarketQuote, MarketSnapshot, TrackerMarket } from "@/modules/tracker/market.types";
import type { MarketRow, MarketRows } from "./tracker.market";
import { isMismatch, venueQuotes } from "./tracker.venues";

/** Steam keeps 15% of a sale (5% Steam + 10% game), so a seller nets 85% of the list price. */
const STEAM_NET = 0.85;
const TICKER_SIZE = 12;
const SPREAD_ROWS = 8;

const GAME_LABEL: Record<string, string> = { cs2: "CS2", dota2: "Dota 2", tf2: "TF2" };
const round = (usd: number) => Math.round(usd * 100) / 100;
const liquidity = (row: MarketRow) => row.listings + row.bids;

/** The switch above the terminal: one game, or the most traded items across all of them. */
function inMarket(row: MarketRow, market: TrackerMarket) {
  if (market === "CS2") return row.gameId === "cs2";
  if (market === "DOTA 2") return row.gameId === "dota2";
  if (market === "LIQUID") return liquidity(row) >= 2;
  return true;
}

function toQuote(row: MarketRow, now: number, simulate: boolean): MarketQuote {
  const floorUsd = row.floorCents / 100;
  const { steam, secondary } = venueQuotes(row, now, simulate);
  const spreadUsd = secondary.usd === null ? null : round(secondary.usd - floorUsd);
  const steamNetUsd = steam.usd === null ? null : round(steam.usd * STEAM_NET);
  const game = GAME_LABEL[row.gameId] ?? row.gameId.toUpperCase();

  return {
    slug: row.slug,
    name: row.name,
    detail: [game, row.rarity && row.rarity.charAt(0).toUpperCase() + row.rarity.slice(1), row.slot].filter(Boolean).join(" · "),
    game,
    floorUsd,
    listings: row.listings,
    bids: row.bids,
    steam,
    secondary,
    vsMarketPct: secondary.usd ? round(((floorUsd - secondary.usd) / secondary.usd) * 100) : null,
    spreadUsd,
    spreadPct: spreadUsd === null ? null : round((spreadUsd / floorUsd) * 100),
    steamNetUsd,
    steamYieldUsd: steamNetUsd === null ? null : round(steamNetUsd - floorUsd),
  };
}

type SnapshotInput = {
  market: TrackerMarket;
  data: MarketRows;
  /** The terminal's focused item: quoted whatever the market filter, so its chart can move live. */
  focus: string | null;
  /** The trader's watched slugs — they lead the ticker. */
  watched: string[];
  alerts: PriceAlert[];
  now: number;
  simulate: boolean;
};

/**
 * One frame of the market terminal. Re-derived from cached rows on every
 * simulation tick (no query), and from fresh rows on every market NOTIFY.
 */
export function toMarketSnapshot({ market, focus, data, watched, alerts, now, simulate }: SnapshotInput): MarketSnapshot {
  const rows = data.rows.filter((row) => inMarket(row, market));
  const focusRow = focus ? data.rows.find((row) => row.slug === focus) : undefined;
  const quotes = rows.map((row) => toQuote(row, now, simulate));
  const watchRank = (slug: string) => (watched.includes(slug) ? watched.indexOf(slug) : Number.MAX_SAFE_INTEGER);
  const byLiquidity = new Map(rows.map((row) => [row.slug, liquidity(row) * 1e9 + row.listedCents]));

  const ticker = [...quotes]
    .sort((a, b) => watchRank(a.slug) - watchRank(b.slug) || (byLiquidity.get(b.slug) ?? 0) - (byLiquidity.get(a.slug) ?? 0))
    .slice(0, TICKER_SIZE);
  const spreads = quotes
    .filter((quote) => quote.spreadPct !== null)
    .sort((a, b) => (b.spreadPct ?? 0) - (a.spreadPct ?? 0))
    .slice(0, SPREAD_ROWS);

  return {
    market,
    at: new Date(now).toISOString(),
    telemetry: {
      items: rows.length,
      listings: rows.reduce((total, row) => total + row.listings, 0),
      bids: rows.reduce((total, row) => total + row.bids, 0),
      listedUsd: rows.reduce((total, row) => total + row.listedCents, 0) / 100,
      sales24h: data.sales.sales,
      sales24hUsd: data.sales.cents / 100,
      feedAt: data.feedAt?.toISOString() ?? null,
      feedMismatches: rows.filter((row) => isMismatch(row.feedCents, row.floorCents) || isMismatch(row.steamCents, row.floorCents)).length,
      simulated: simulate,
    },
    ticker,
    focus: focusRow ? toQuote(focusRow, now, simulate) : null,
    spreads,
    alerts,
  };
}
