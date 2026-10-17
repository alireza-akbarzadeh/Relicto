ALTER TABLE "items" ADD COLUMN "collection" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "min_float" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "max_float" real DEFAULT 1;--> statement-breakpoint
CREATE INDEX "items_collection_idx" ON "items" USING btree ("collection");--> statement-breakpoint
ALTER TABLE "inventory_items" ADD COLUMN "collection" text;--> statement-breakpoint
ALTER TABLE "trade_up_outcomes" ADD COLUMN "collection" text;--> statement-breakpoint
CREATE INDEX "trade_up_outcomes_collection_idx" ON "trade_up_outcomes" USING btree ("collection");
