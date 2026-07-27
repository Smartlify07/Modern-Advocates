import "dotenv"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

type SendOTPParams = {
  email: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password" | "change-email"
}

const fromAddress = (() => {
  const from = process.env.RESEND_FROM_EMAIL
  if (!from) throw new Error("RESEND_FROM_EMAIL is not set")
  return `ModernAdvocates <${from}>`
})()

export async function sendOTPEmail({ email, otp, type }: SendOTPParams) {
  const subject =
    type === "sign-in"
      ? "Your login code"
      : type === "email-verification"
        ? "Verify your email"
        : "Reset your password"

  try {
    const res = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject,
      html: `<p>Your code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
    })

    return res.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function sendTeamInviteEmail({
  email,
  token,
  role,
  inviterName,
}: {
  email: string
  token: string
  role: string
  inviterName: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3344"
  const acceptLink = `${appUrl}/invite/accept?token=${token}`

  try {
    const res = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `You've been invited to join Modern Advocates as ${role}`,
      html: `
        <p>${inviterName} has invited you to join Modern Advocates as <strong>${role}</strong>.</p>
        <p><a href="${acceptLink}">Click here to accept your invitation</a></p>
        <p>This invitation will expire in 7 days.</p>
      `,
    })

    return res.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
