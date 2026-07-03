import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { db } from "@/infrastructure/database/client"
import { schema } from "@/infrastructure/database/schema/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: {
    allowedHosts: ["localhost:3000", "modern-advocates.vercel.app"],
  },
  emailAndPassword: { enabled: true },

  plugins: [admin()],
})
