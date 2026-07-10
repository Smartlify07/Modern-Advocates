CREATE TYPE "public"."order_source" AS ENUM('purchase', 'admin', 'scholarship', 'coupon', 'gift');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"course_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"payment_provider" text,
	"payment_reference" text,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"source" "order_source" DEFAULT 'purchase' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."enrollment_status";--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('pending', 'active', 'revoked', 'failed');--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enrollment_status";--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DATA TYPE "public"."enrollment_status" USING (
  CASE "status"::text
    WHEN 'completed' THEN 'active'
    WHEN 'cancelled' THEN 'revoked'
    ELSE "status"::text
  END
)::"public"."enrollment_status";--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "order_id" uuid;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_student_id_idx" ON "orders" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "orders_course_id_idx" ON "orders" USING btree ("course_id");--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
