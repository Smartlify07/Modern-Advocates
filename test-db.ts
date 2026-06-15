import { auth } from "./lib/auth/auth"
import { db } from "./lib/db/client"
import { session, user } from "./lib/db/schema/auth"

// A quick runtime check
async function diagnosticCheck() {
  // 1. Check native drizzle
  const drizzleUsers = await db.select().from(session).limit(1)

  // 2. Check via Better Auth's internal adapter mapping
  const authUserCount = await auth.api.listSessions()
}

diagnosticCheck()
