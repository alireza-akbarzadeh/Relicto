import { text, timestamp } from "drizzle-orm/pg-core";

/** Text primary key, generated app-side so ids are stable before insert. */
export const primaryId = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

/** Every table carries both stamps; `updated_at` moves on write. */
export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Append-only rows (events, ledger, time series) only need a birth stamp. */
export const createdAt = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
};
