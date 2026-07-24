import { config } from "dotenv"
import { resolve } from "path"

const envFile = process.argv[2]
if (envFile) {
  config({ path: resolve(envFile) })
} else {
  config()
}

await import("../seed")
