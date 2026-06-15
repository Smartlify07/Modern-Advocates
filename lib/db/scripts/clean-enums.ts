import { config } from "dotenv"
config({ path: ".env" })

import { Pool } from "pg"

const ENUMS = [
  "course_status",
  "enrollment_status",
  "level",
  "profile_type",
  "topic_format",
]

async function cleanEnums() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    connectionTimeoutMillis: 10000,
  })

  for (const name of ENUMS) {
    try {
      await pool.query(`DROP TYPE IF EXISTS "${name}"`)
      console.log(`  ✓ Dropped orphaned enum "${name}"`)
    } catch (e: any) {
      if (e?.code === "2BP01") {
        console.log(`  ∼ Skipped "${name}" — in use by tables`)
      } else {
        throw e
      }
    }
  }

  await pool.end()
  console.log("Enums cleaned — ready for migration")
}

cleanEnums().catch((e) => {
  console.error("Failed to clean enums:", e)
  process.exit(1)
})
