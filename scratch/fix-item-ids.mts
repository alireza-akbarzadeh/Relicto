import { db } from "../src/lib/db";
import { inventoryItems } from "../src/lib/db/schema/inventory";
import { items } from "../src/lib/db/schema/catalog";
import { eq, ilike, isNull, and, or } from "drizzle-orm";

async function main() {
  const unlinked = await db
    .select()
    .from(inventoryItems)
    .where(isNull(inventoryItems.itemId));

  console.log(`Found ${unlinked.length} unlinked inventory items.`);

  for (const row of unlinked) {
    const candidates = [
      row.name,
      row.name.replace(/^★\s*/, "").trim(),
      row.name.replace(/^★\s*/, "").replace(/^(StatTrak™|Souvenir)\s*/, "").trim(),
      row.name.replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)$/i, "").trim(),
      row.name.replace(/^★\s*/, "").replace(/^(StatTrak™|Souvenir)\s*/, "").replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)$/i, "").trim(),
    ];

    let matchedId: string | null = null;
    for (const cand of candidates) {
      if (!cand) continue;
      const [found] = await db
        .select({ id: items.id, name: items.name })
        .from(items)
        .where(ilike(items.name, cand))
        .limit(1);
      if (found) {
        matchedId = found.id;
        console.log(`Matched "${row.name}" -> catalog "${found.name}" (${found.id})`);
        break;
      }
    }

    if (matchedId) {
      await db
        .update(inventoryItems)
        .set({ itemId: matchedId })
        .where(eq(inventoryItems.id, row.id));
    } else {
      console.log(`No catalog match for "${row.name}"`);
    }
  }

  console.log("Done fixing item IDs!");
}

main().catch(console.error);
