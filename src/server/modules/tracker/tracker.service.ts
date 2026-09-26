import "server-only";

import type { marketSpreads } from "@/lib/db/schema";
import type { IconName } from "@/components/ui/icon";
import type { OrderLevel, SpreadRow, TrackerAsset, TrackerData, TrackerTone } from "@/modules/tracker/types";
import type { TrackerMobileData } from "@/modules/tracker/mobile.types";
import { toArbitrage, toAsset, toCandleChart, toDepth, toFeed } from "./tracker-mobile.presenter";
import * as repository from "./tracker.repository";
import { findPriceHistory } from "../items/items.repository";
import { findBookRows, findFocusItem, toLiveBook } from "./tracker.book";
import { toTrackerLive } from "./tracker.live";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pct = (value: number) => `${value >= 0 ? "+" : ""}${Math.round(value * 10) / 10}%`;

/** The board item whose depth and chart the terminal is focused on. */
const FOCUS_SLUG = "butterfly-doppler";

/** Chart points are normalised to 0–100 so the sparkline scales itself. */
function toChart(points: { priceCents: number }[], buckets = 12): number[] {
  if (points.length === 0) return [];

  const step = Math.max(1, Math.floor(points.length / buckets));
  const sampled = Array.from({ length: buckets }, (_, i) => points[Math.min(i * step, points.length - 1)].priceCents);
  const low = Math.min(...sampled);
  const high = Math.max(...sampled);

  if (high === low) return sampled.map(() => 50);
  return sampled.map((cents) => Math.round(((cents - low) / (high - low)) * 80) + 10);
}

export const trackerService = {
  /** The trader's tracker terminal: board, depth, spreads and chart. */
  async terminal(userId: string, focusSlug: string = FOCUS_SLUG): Promise<TrackerData> {
    const focusItem = (await findFocusItem(focusSlug)) ?? (await findFocusItem(FOCUS_SLUG));
    const slug = focusItem?.slug ?? FOCUS_SLUG;
    const [board, book, spreads, series, bookRows, history] = await Promise.all([
      repository.findBoard(userId),
      repository.findBook(slug),
      repository.findSpreads(),
      repository.findSeries(slug),
      focusItem ? findBookRows(focusItem.id) : null,
      focusItem ? findPriceHistory(focusItem.id) : [],
    ]);

    const assets: TrackerAsset[] = board.map(({ row, name, slug: itemSlug, floorCents, changePercent }) => ({
      id: row.id,
      slug: itemSlug,
      name: row.label ?? name,
      detail: row.detail ?? "",
      image: row.thumbnailUrl ?? "",
      price: money(floorCents),
      change: pct(changePercent),
      tone: row.tone as TrackerTone,
      icon: row.icon as IconName,
    }));

    const orderBook: OrderLevel[] = book.map(({ level }) => ({
      price: money(level.priceCents),
      source: level.source,
      total: money(level.totalCents),
      side: level.side,
    }));

    // Real panels for the focused item: the live book, the market series and computed tiles.
    const live = focusItem && bookRows ? toTrackerLive(focusItem, toLiveBook(focusItem.slug, bookRows), history) : undefined;
    return { assets, orderBook, spreads: spreads.map(({ spread }) => toSpread(spread)), chart: toChart(series), live };
  },

  /**
   * The same board, book, spreads and price history in the mobile terminal's
   * shape. `authored` supplies what isn't recorded yet: telemetry, relay copy,
   * volume bars and the other Doppler phases.
   */
  async terminalMobile(userId: string, authored: TrackerMobileData): Promise<TrackerMobileData | null> {
    const [board, book, spreads, series, focus] = await Promise.all([
      repository.findBoard(userId),
      repository.findBook(FOCUS_SLUG),
      repository.findSpreads(),
      repository.findSeries(FOCUS_SLUG),
      repository.findFocus(FOCUS_SLUG),
    ]);
    if (board.length === 0 || !focus) return null;

    return {
      ...authored,
      feed: toFeed(board),
      asset: toAsset(focus, authored.asset),
      chart: toCandleChart(series.map((point) => point.priceCents), authored.chart),
      // The listed copy's phase trades at the live floor; the others aren't carried.
      phases: authored.phases.map((phase) =>
        phase.id === authored.defaultPhase ? { ...phase, priceUsd: focus.listing.priceCents / 100 } : phase,
      ),
      depth: toDepth(book),
      arbitrage: { ...authored.arbitrage, cards: toArbitrage(spreads) },
    };
  },
};

/** Spread is the secondary venue over Relicto's floor; yield is that, net of fees. */
function toSpread(row: typeof marketSpreads.$inferSelect): SpreadRow {
  const spreadCents = row.secondaryCents - row.floorCents;
  const netCents = Math.round(spreadCents * (1 - row.feeBps / 10000));

  return {
    id: row.id,
    asset: row.asset,
    detail: row.detail ?? "",
    floor: money(row.floorCents),
    steam: money(row.steamCents),
    secondary: money(row.secondaryCents),
    spread: `${spreadCents >= 0 ? "+" : "-"}${money(Math.abs(spreadCents))} (${pct((spreadCents / row.floorCents) * 100)})`,
    yield: `${netCents >= 0 ? "+" : "-"}${money(Math.abs(netCents))} USD`,
    tone: row.tone as TrackerTone,
  };
}
