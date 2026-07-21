export type TicketStatus = "open" | "pending" | "resolved"

export interface Ticket {
  id: string
  name: string
  email: string
  message: string
  status: TicketStatus
  date: string
}
