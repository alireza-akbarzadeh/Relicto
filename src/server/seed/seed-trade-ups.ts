/**
 * The mobile trade-up chamber, seeded from `sell-mobile.mock`: the ten skins
 * (seven committed, three for Smart Fill) as the trader's inventory, the CS2
 * outcome pool, and an open draft holding the committed seven.
 *
 * Forge-made rows undo themselves on a re-seed: contracts are rebuilt here,
 * outcome copies have generated ids that `clearStudioWrites` deletes, and burned
 * inputs come back through the upsert below.
 */
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { sellMobile } from "../../modules/sell/data/sell-mobile.mock";
import type { ContractItem } from "../../modules/sell/mobile.types";

type Db = NodePgDatabase<typeof schema>;

const cents = (usd: number) => Math.round(usd * 100);
const SEED = 9472;

/** Steam's full market names; the mock only carries the tiles' short labels. */
const NAMES: Record<string, string> = {
  "ak-redline": "AK-47 | Redline",
  "awp-wildfire": "AWP | Wildfire",
  "m4a4-emperor": "M4A4 | The Emperor",
  "deagle-printstream": "Desert Eagle | Printstream",
  "usp-kill-confirmed": "USP-S | Kill Confirmed",
  "glock-water": "Glock-18 | Water Elemental",
  "m4a1-hyper-beast": "M4A1-S | Hyper Beast",
  "awp-asiimov-ft": "AWP | Asiimov",
  "deagle-printstream-mw": "Desert Eagle | Printstream",
  "glock-high-beam": "Glock-18 | High Beam",
};

const WEAR = [[0.07, "Factory New"], [0.15, "Minimal Wear"], [0.38, "Field-Tested"], [0.45, "Well-Worn"], [1.01, "Battle-Scarred"]] as const;

const inventoryId = (traderId: string, id: string) => `inv-${traderId}-tu-${id}`;

async function seedSkin(db: Db, traderId: string, item: ContractItem, order: number) {
  const float = item.float ?? 0;
  const row = {
    id: inventoryId(traderId, item.id),
    userId: traderId,
    gameId: "cs2",
    assetId: `steam-tu-${item.id}`,
    name: NAMES[item.id] ?? item.imageAlt,
    rarityLabel: item.rarity,
    wearLabel: WEAR.find(([max]) => float < max)![1],
    floatLabel: float.toFixed(4),
    imageUrl: item.image,
    imageAlt: item.imageAlt,
    priceCents: cents(item.priceUsd),
    floorCents: cents(item.priceUsd),
    wearPct: Math.round(float * 100),
    tone: "muted",
    sortOrder: 100 + order,
  } satisfies typeof schema.inventoryItems.$inferInsert;

  await db.insert(schema.inventoryItems).values(row).onConflictDoUpdate({ target: schema.inventoryItems.id, set: row });
}

async function seedOutcomes(db: Db) {
  for (const [order, outcome] of sellMobile.contract.outcomes.entries()) {
    const row = {
      id: `tuo-${outcome.id}`,
      gameId: "cs2",
      name: outcome.name,
      imageUrl: outcome.image,
      imageAlt: outcome.imageAlt,
      valueCents: cents(outcome.valueUsd),
      chancePct: outcome.chance,
      tone: outcome.tone,
      sortOrder: order,
    } satisfies typeof schema.tradeUpOutcomes.$inferInsert;

    await db.insert(schema.tradeUpOutcomes).values(row).onConflictDoUpdate({ target: schema.tradeUpOutcomes.id, set: row });
  }
}

export async function seedTradeUps(db: Db, traderId: string) {
  const { committed, suggestions } = sellMobile.contract;
  const skins = [...committed, ...suggestions].filter((item): item is ContractItem => item !== null);

  for (const [order, item] of skins.entries()) await seedSkin(db, traderId, item, order);
  await seedOutcomes(db);

  // Every contract the trader ran, and the draft, start over.
  await db.delete(schema.tradeUpContracts).where(eq(schema.tradeUpContracts.userId, traderId));
  const draftId = `tradeup-${traderId}-draft`;
  const inputs = committed.flatMap((item, slot) => (item ? [{ item, slot }] : []));
  await db.insert(schema.tradeUpContracts).values({
    id: draftId,
    userId: traderId,
    seed: SEED,
    inputValueCents: inputs.reduce((sum, { item }) => sum + cents(item.priceUsd), 0),
  });
  await db.insert(schema.tradeUpItems).values(
    inputs.map(({ item, slot }) => ({
      contractId: draftId,
      inventoryItemId: inventoryId(traderId, item.id),
      slot,
      valueCents: cents(item.priceUsd),
    })),
  );

  return { skins: skins.length, outcomes: sellMobile.contract.outcomes.length, committed: inputs.length };
}
