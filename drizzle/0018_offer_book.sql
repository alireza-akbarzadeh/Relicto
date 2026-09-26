ALTER TYPE "public"."offer_status" ADD VALUE 'withdrawn';--> statement-breakpoint
ALTER TYPE "public"."notification_kind" ADD VALUE 'offer_received' BEFORE 'system';--> statement-breakpoint
ALTER TYPE "public"."notification_kind" ADD VALUE 'offer_accepted' BEFORE 'system';--> statement-breakpoint
ALTER TYPE "public"."notification_kind" ADD VALUE 'offer_declined' BEFORE 'system';--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "order_id" text;--> statement-breakpoint
-- One open bid per buyer per listing: keep each buyer's highest, retire the rest.
UPDATE "offers" SET "status" = 'declined' WHERE "id" IN (
	SELECT "id" FROM (
		SELECT "id", row_number() OVER (PARTITION BY "listing_id", "buyer_id" ORDER BY "price_cents" DESC, "created_at" DESC) AS "rank"
		FROM "offers" WHERE "status" = 'pending'
	) AS "ranked" WHERE "rank" > 1
);--> statement-breakpoint
CREATE UNIQUE INDEX "offers_open_bid_idx" ON "offers" USING btree ("listing_id","buyer_id") WHERE "offers"."status" = 'pending';