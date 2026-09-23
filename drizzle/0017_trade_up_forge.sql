CREATE TABLE "trade_up_outcomes" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"item_id" text,
	"name" text NOT NULL,
	"image_url" text,
	"image_alt" text,
	"value_cents" integer NOT NULL,
	"chance_pct" real NOT NULL,
	"tone" text DEFAULT 'mid' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trade_up_contracts" ADD COLUMN "seed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "trade_up_contracts" ADD COLUMN "outcome_id" text;--> statement-breakpoint
ALTER TABLE "trade_up_items" ADD COLUMN "inventory_item_id" text;--> statement-breakpoint
ALTER TABLE "trade_up_outcomes" ADD CONSTRAINT "trade_up_outcomes_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_up_outcomes" ADD CONSTRAINT "trade_up_outcomes_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "trade_up_outcomes_game_idx" ON "trade_up_outcomes" USING btree ("game_id","sort_order");--> statement-breakpoint
ALTER TABLE "trade_up_contracts" ADD CONSTRAINT "trade_up_contracts_outcome_id_trade_up_outcomes_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."trade_up_outcomes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_up_items" ADD CONSTRAINT "trade_up_items_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "trade_up_contracts_one_draft_idx" ON "trade_up_contracts" USING btree ("user_id") WHERE "trade_up_contracts"."status" = 'draft';--> statement-breakpoint
CREATE UNIQUE INDEX "trade_up_items_contract_slot_idx" ON "trade_up_items" USING btree ("contract_id","slot");--> statement-breakpoint
CREATE INDEX "trade_up_items_inventory_idx" ON "trade_up_items" USING btree ("inventory_item_id");