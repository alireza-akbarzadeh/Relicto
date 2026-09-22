CREATE TYPE "public"."profile_status_group" AS ENUM('security', 'linked', 'safeguards');--> statement-breakpoint
CREATE TABLE "profile_endorsements" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"label" text NOT NULL,
	"pct" real NOT NULL,
	"tone" text DEFAULT 'muted' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_status_rows" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"group" "profile_status_group" NOT NULL,
	"icon" text NOT NULL,
	"icon_tone" text DEFAULT 'muted' NOT NULL,
	"title" text NOT NULL,
	"detail" text,
	"status" text NOT NULL,
	"status_tone" text DEFAULT 'muted' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "floor_cents" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "steam_market_cents" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "seller_note" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_alt" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "banner_alt" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "telemetry" jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "ranks" jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "handshake_label" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_handshake" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "inventory_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "portfolio_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "portfolio_change_percent" real;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "rating_hundredths" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "author_handle" text DEFAULT 'trader' NOT NULL;--> statement-breakpoint
ALTER TABLE "showcase_items" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "showcase_items" ADD COLUMN "image_alt" text;--> statement-breakpoint
ALTER TABLE "showcase_items" ADD COLUMN "tone" text DEFAULT 'muted' NOT NULL;--> statement-breakpoint
ALTER TABLE "showcase_items" ADD COLUMN "presentation" jsonb;--> statement-breakpoint
ALTER TABLE "profile_endorsements" ADD CONSTRAINT "profile_endorsements_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_status_rows" ADD CONSTRAINT "profile_status_rows_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_endorsements_profile_idx" ON "profile_endorsements" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "profile_status_rows_profile_idx" ON "profile_status_rows" USING btree ("profile_id","group");