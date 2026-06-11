import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the .env file")
}

config({ path: ".env" })

export default defineConfig({
  schema: "./lib/db/schema.ts", // Your schema file path
  out: "./drizzle", // Your migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
