CREATE TABLE "inventory_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"game_id" text NOT NULL,
	"item_id" text,
	"listing_id" text,
	"asset_id" text,
	"name" text NOT NULL,
	"marker" text,
	"rarity_label" text,
	"wear_label" text,
	"float_label" text,
	"rank_label" text,
	"image_url" text,
	"image_alt" text,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"floor_cents" integer DEFAULT 0 NOT NULL,
	"wear_pct" real DEFAULT 0 NOT NULL,
	"tone" text DEFAULT 'muted' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "inventory_counts" jsonb;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventory_items_user_idx" ON "inventory_items" USING btree ("user_id","game_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_items_user_asset_idx" ON "inventory_items" USING btree ("user_id","asset_id");