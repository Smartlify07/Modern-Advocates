export interface ValidateResult {
  valid: boolean
  expired?: boolean
  email?: string
  role?: string
  userExists?: boolean
  alreadyMember?: boolean
  userId?: string | null
  userName?: string | null
  invitedByName?: string | null
  invitedByEmail?: string | null
}

export type AcceptStep =
  | { type: "loading" }
  | { type: "invalid"; error: string }
  | { type: "authenticated"; email: string; role: string; invitedByName?: string | null; invitedByEmail?: string | null }
  | { type: "login"; email: string; role: string; invitedByName?: string | null; invitedByEmail?: string | null }
  | { type: "signup"; email: string; role: string; invitedByName?: string | null; invitedByEmail?: string | null }
  | { type: "accepted" }
  | { type: "declined"; invitedByName?: string | null; invitedByEmail?: string | null }

export function formatInviteDate(): string {
  const now = new Date()
  const day = now.toLocaleDateString("en-US", { weekday: "long" })
  const month = now.toLocaleDateString("en-US", { month: "long" })
  const date = now.getDate()
  const year = now.getFullYear()
  return `${day}, ${month} ${date}. ${year}`
}
