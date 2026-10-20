import { db } from "../src/lib/db";
import { account } from "../src/lib/db/schema/auth";
import { profiles } from "../src/lib/db/schema/profiles";
import { eq } from "drizzle-orm";
import { inventorySyncService } from "../src/server/modules/inventory-sync/inventory-sync.service";
import { sellService } from "../src/server/modules/sell/sell.service";

async function main() {
  const userId = "seed-trader-relicto";
  const accounts = await db.select().from(account).where(eq(account.userId, userId));
  console.log("Account rows for seed-trader-relicto:", accounts);

  const [prof] = await db.select().from(profiles).where(eq(profiles.userId, userId));
  console.log("Profile steamId:", prof?.steamId);

  const syncStatus = await inventorySyncService.status(userId);
  console.log("Sync status:", syncStatus);

  const studio = await sellService.studio(userId);
  console.log("Studio inventory length:", studio.inventory.length);
  console.log("Studio totalInventory:", studio.totalInventory);
}

main().catch(console.error);
