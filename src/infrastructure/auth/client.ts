import { createAuthClient } from "better-auth/react"
import { adminClient, emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://modern-advocates.vercel.app",

  plugins: [adminClient(), emailOTPClient()],
})
