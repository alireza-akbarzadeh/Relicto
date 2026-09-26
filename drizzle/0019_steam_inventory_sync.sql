CREATE TYPE "public"."inventory_sync_status" AS ENUM('ok', 'private', 'rate-limited', 'unavailable');--> statement-breakpoint
CREATE TABLE "inventory_syncs" (
	"user_id" text PRIMARY KEY NOT NULL,
	"steam_id" text NOT NULL,
	"status" "inventory_sync_status" NOT NULL,
	"item_count" integer DEFAULT 0 NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_syncs" ADD CONSTRAINT "inventory_syncs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;