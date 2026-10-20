import { db } from "../src/lib/db";
import { inventoryItems } from "../src/lib/db/schema/inventory";
import { eq } from "drizzle-orm";

async function main() {
  const items = await db.select().from(inventoryItems).limit(20);
  console.log("Total inventory items sample:", items.length);
  for (const it of items) {
    console.log(`Item: id=${it.id} user=${it.userId} name=${it.name} game=${it.gameId} price=${it.priceCents/100} listingId=${it.listingId}`);
  }
}

main().catch(console.error);
