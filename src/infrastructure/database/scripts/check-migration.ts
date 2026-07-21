import { db } from "../client"
import { sql } from "drizzle-orm"

async function main() {
  const cols = await db.execute(sql`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'donations'
    ORDER BY ordinal_position
  `)
  console.log(JSON.stringify(cols.rows, null, 2))

  const rows = await db.execute(sql`SELECT id, donor_name, currency, payment_status FROM donations`)
  console.log("Existing data:", JSON.stringify(rows.rows, null, 2))

  process.exit(0)
}

main().catch((e) => {
  console.error("Error:", e.message)
  process.exit(1)
})
