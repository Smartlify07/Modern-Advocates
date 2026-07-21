import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, emailOTP } from "better-auth/plugins"
import { db } from "@/infrastructure/database/client"
import { schema } from "@/infrastructure/database/schema/schema"
import { sendOTPEmail } from "../email/send"
import { ac, admin as adminRole, manager, editor, instructor, user as userRole } from "./permissions"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "*.vercel.app",
    ],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    fallback: "https://modern-advocates.vercel.app",
  },
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
    },
  },

  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        manager,
        editor,
        instructor,
        user: userRole,
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (process.env.NODE_ENV !== "production")
          console.log(`[DEV] OTP for ${email}: ${otp}`)
        await sendOTPEmail({ email, otp, type })
      },
    }),
  ],
})
