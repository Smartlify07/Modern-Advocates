CREATE TABLE "topic_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_completion" UNIQUE("enrollment_id","topic_id")
);
--> statement-breakpoint
ALTER TABLE "topic_completions" ADD CONSTRAINT "topic_completions_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_completions" ADD CONSTRAINT "topic_completions_topic_id_course_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."course_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "topic_completions_enrollment_idx" ON "topic_completions" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "topic_completions_topic_idx" ON "topic_completions" USING btree ("topic_id");