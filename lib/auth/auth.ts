import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { db } from "../db/client"
import { schema } from "../db/schema/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: { enabled: true },

  plugins: [admin()],
})
