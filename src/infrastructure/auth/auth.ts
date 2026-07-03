import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, emailOTP } from "better-auth/plugins"
import { db } from "@/infrastructure/database/client"
import { schema } from "@/infrastructure/database/schema/schema"
import { sendOTPEmail } from "@/infrastructure/email/send"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOTPEmail({ email, otp, type })
      },
    }),
  ],
})
