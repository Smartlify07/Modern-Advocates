import { createAuthClient } from "better-auth/react"
import { adminClient, emailOTPClient } from "better-auth/client/plugins"

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://modern-advocates.vercel.app"

export const authClient = createAuthClient({
  baseURL: BASE_URL,

  plugins: [adminClient(), emailOTPClient()],
})
