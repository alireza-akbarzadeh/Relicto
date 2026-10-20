import { db } from "../src/lib/db";
import { inventoryItems } from "../src/lib/db/schema/inventory";
import { eq } from "drizzle-orm";

async function main() {
  const items = await db.select().from(inventoryItems).where(eq(inventoryItems.userId, "seed-trader-relicto"));
  console.log("Items for seed-trader-relicto:", items.map(i => ({ id: i.id, name: i.name, itemId: i.itemId, listingId: i.listingId })));
}

main().catch(console.error);
