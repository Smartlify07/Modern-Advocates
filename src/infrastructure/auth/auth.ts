import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, emailOTP } from "better-auth/plugins"
import { db } from "@/infrastructure/database/client"
import { schema } from "@/infrastructure/database/schema/schema"
import { sendOTPEmail } from "../email/send"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: {
    allowedHosts: ["localhost:*", "modern-advocates.vercel.app"],
  },
  emailAndPassword: { enabled: true },

  plugins: [
    admin({}),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (process.env.NODE_ENV !== "production")
          console.log(`[DEV] OTP for ${email}: ${otp}`)
        await sendOTPEmail({ email, otp, type })
      },
    }),
  ],
})
