ALTER TABLE "donations" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "currency" text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "stripe_checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
