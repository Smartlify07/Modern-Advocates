CREATE TYPE "public"."team_invite_status" AS ENUM('pending', 'accepted', 'cancelled');--> statement-breakpoint
CREATE TABLE "team_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "team_role" DEFAULT 'Editor' NOT NULL,
	"token" text NOT NULL,
	"invited_by_id" text,
	"expires_at" timestamp,
	"status" "team_invite_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_invited_by_id_user_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "pending_invite_email_idx" ON "team_invites" USING btree ("email") WHERE status = 'pending';