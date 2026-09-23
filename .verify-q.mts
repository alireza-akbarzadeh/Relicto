import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
const { db } = await import("@/lib/db");
const { sql } = await import("drizzle-orm");
const [u] = (await db.execute(sql`select id from "user" where email = 'claude-push-qa@relicto.test'`)).rows as any[];
console.log(JSON.stringify({
  notes: (await db.execute(sql`select kind, title from notifications where user_id = ${u.id}`)).rows,
  subs: (await db.execute(sql`select last_success_at from push_subscriptions where user_id = ${u.id}`)).rows,
}));
process.exit(0);
