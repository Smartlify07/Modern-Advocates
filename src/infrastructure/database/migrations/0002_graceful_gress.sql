CREATE TABLE IF NOT EXISTS "course_videos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "course_id" uuid NOT NULL,
  "module_id" uuid NOT NULL,
  "topic_id" uuid NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "cloudinary_public_id" text,
  "playback_url" text,
  "thumbnail_url" text,
  "duration" integer,
  "status" text DEFAULT 'uploading' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_videos" ADD CONSTRAINT "course_videos_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "course_videos" ADD CONSTRAINT "course_videos_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "course_videos" ADD CONSTRAINT "course_videos_topic_id_course_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."course_topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "course_videos_topic_id_idx" ON "course_videos" USING btree ("topic_id");
--> statement-breakpoint
CREATE INDEX "course_videos_course_id_idx" ON "course_videos" USING btree ("course_id");
--> statement-breakpoint
CREATE INDEX "course_videos_module_id_idx" ON "course_videos" USING btree ("module_id");
--> statement-breakpoint
CREATE INDEX "course_videos_status_idx" ON "course_videos" USING btree ("status");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "video_id" uuid NOT NULL,
  "watched_seconds" integer DEFAULT 0 NOT NULL,
  "completed" boolean DEFAULT false NOT NULL,
  "last_watched_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "video_progress" ADD CONSTRAINT "video_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "video_progress" ADD CONSTRAINT "video_progress_video_id_course_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."course_videos"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "video_progress_user_video_idx" ON "video_progress" USING btree ("user_id", "video_id");
--> statement-breakpoint
CREATE INDEX "video_progress_video_id_idx" ON "video_progress" USING btree ("video_id");
