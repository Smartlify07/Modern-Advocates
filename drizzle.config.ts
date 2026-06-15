import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env" })

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error("DATABASE_URL is not set in the .env file")
}

export default defineConfig({
  schema: "./lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
  verbose: true,
  strict: true,
})
