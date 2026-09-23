ALTER TABLE "alert_rules" ADD COLUMN "detail" text;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD COLUMN "icon" text DEFAULT 'notifications' NOT NULL;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD COLUMN "current_cents" integer;