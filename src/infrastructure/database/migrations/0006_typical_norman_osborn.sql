CREATE TYPE "public"."donation_type" AS ENUM('fixed', 'tier', 'monthly');--> statement-breakpoint
CREATE TABLE "donations" (
	"id" text PRIMARY KEY NOT NULL,
	"donor_name" text NOT NULL,
	"donor_email" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"donation_type" "donation_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");