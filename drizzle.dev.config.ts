import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local", override: true })

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error("DATABASE_URL is not set in .env.local")
}

export default defineConfig({
  schema: "./src/infrastructure/database/schema",
  out: "./src/infrastructure/database/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true,
})
