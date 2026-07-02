import "dotenv"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

type SendOTPParams = {
  email: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password" | "change-email"
}

export async function sendOTPEmail({ email, otp, type }: SendOTPParams) {
  const subject =
    type === "sign-in"
      ? "Your login code"
      : type === "email-verification"
        ? "Verify your email"
        : "Reset your password"

  const res = void resend.emails.send({
    from: "ModernAdvocates <onboarding@resend.dev>",
    to: email,
    subject,
    html: `<p>Your code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
  })
}
