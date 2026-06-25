-- Fix courses.tutor_id column type: uuid → text, FK → user.id
-- The original migration incorrectly defined tutor_id as uuid referencing profiles.id,
-- but it should be text referencing user.id (which is text).

ALTER TABLE "courses" DROP CONSTRAINT "courses_tutor_id_profiles_id_fk";

ALTER TABLE "courses" ALTER COLUMN "tutor_id" TYPE text USING tutor_id::text;

ALTER TABLE "courses" ADD CONSTRAINT "courses_tutor_id_user_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;
