export type TicketStatus = "open" | "pending" | "resolved"

export interface Ticket {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: TicketStatus
  date: string
}
