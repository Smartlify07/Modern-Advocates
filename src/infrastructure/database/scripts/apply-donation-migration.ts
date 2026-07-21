import { db } from "../client"
import { sql } from "drizzle-orm"

async function main() {
  console.log("Applying donation table migration...")

  await db.execute(sql`DELETE FROM donations`)
  console.log("Cleared existing donations data")

  await db.execute(sql`ALTER TABLE "donations" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid`)
  await db.execute(sql`ALTER TABLE "donations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`)
  await db.execute(sql`ALTER TABLE "donations" ADD COLUMN "currency" text DEFAULT 'USD' NOT NULL`)
  await db.execute(sql`ALTER TABLE "donations" ADD COLUMN "stripe_checkout_session_id" text`)
  await db.execute(sql`ALTER TABLE "donations" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending' NOT NULL`)
  await db.execute(sql`ALTER TABLE "donations" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL`)
  console.log("All columns added successfully")

  const cols = await db.execute(sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'donations'
    ORDER BY ordinal_position
  `)
  console.log("Final schema:", JSON.stringify(cols.rows, null, 2))

  console.log("Migration complete!")
  process.exit(0)
}

main().catch((e) => {
  console.error("Migration failed:", e.message)
  process.exit(1)
})
