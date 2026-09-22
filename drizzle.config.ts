import { defineConfig } from "drizzle-kit";

/** Migrations run over the direct (unpooled) endpoint; the app uses the pooler. */
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: url!,
  },
});
