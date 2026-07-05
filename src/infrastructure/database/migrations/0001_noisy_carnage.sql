DROP TABLE "course_categories" CASCADE;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_free" boolean DEFAULT false NOT NULL;