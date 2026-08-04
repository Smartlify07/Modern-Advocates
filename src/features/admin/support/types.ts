export type TicketStatus = "open" | "pending" | "resolved"

export interface Ticket {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: TicketStatus
  createdAt: string
}

export interface ListSupportTicketsParams {
  search?: string
  filter?: string
  page?: number
  pageSize?: number
}

export interface ListSupportTicketsResult {
  tickets: Ticket[]
  total: number
  open: number
  pending: number
  resolved: number
  page: number
  pageSize: number
  totalPages: number
}
