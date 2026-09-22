ALTER TABLE "community_posts" ADD COLUMN "tag_tone" text DEFAULT 'muted' NOT NULL;--> statement-breakpoint
ALTER TABLE "guilds" ADD COLUMN "tone" text DEFAULT 'muted' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "role_tone" text DEFAULT 'muted' NOT NULL;--> statement-breakpoint
ALTER TABLE "wiki_guides" ADD COLUMN "presentation" jsonb;--> statement-breakpoint
ALTER TABLE "wiki_revisions" ADD COLUMN "tone" text DEFAULT 'muted' NOT NULL;