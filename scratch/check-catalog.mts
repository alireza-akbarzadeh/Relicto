import { db } from "../src/lib/db";
import { items } from "../src/lib/db/schema/catalog";
import { ilike } from "drizzle-orm";

async function main() {
  const guns = await db
    .select({ id: items.id, name: items.name, gameId: items.gameId })
    .from(items)
    .where(ilike(items.name, "%Printstream%"));
  console.log("Printstream in catalog:", guns);

  const ak = await db
    .select({ id: items.id, name: items.name, gameId: items.gameId })
    .from(items)
    .where(ilike(items.name, "%Redline%"));
  console.log("Redline in catalog:", ak);

  const asiimov = await db
    .select({ id: items.id, name: items.name, gameId: items.gameId })
    .from(items)
    .where(ilike(items.name, "%Asiimov%"));
  console.log("Asiimov in catalog:", asiimov);
}

main().catch(console.error);
