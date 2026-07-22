import { db } from "@/infrastructure/database/client"
import { contacts } from "@/infrastructure/database/schema/contact"
import { eq, ilike, or, and, sql, desc } from "drizzle-orm"

export interface ListSupportTicketsParams {
  search?: string
  filter?: string
  page?: number
  pageSize?: number
}

export interface TicketDTO {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: "open" | "pending" | "resolved"
  createdAt: string
}

export interface ListSupportTicketsResult {
  tickets: TicketDTO[]
  total: number
  open: number
  pending: number
  resolved: number
  page: number
  pageSize: number
  totalPages: number
}

export async function listSupportTickets(
  params: ListSupportTicketsParams,
): Promise<ListSupportTicketsResult> {
  const { search, filter, page: rawPage = 1, pageSize = 10 } = params
  const page = Math.max(1, rawPage)

  const conditions = []

  if (search) {
    const q = `%${search}%`
    conditions.push(
      or(
        ilike(contacts.name, q),
        ilike(contacts.email, q),
        ilike(contacts.message, q),
      ),
    )
  }

  if (filter === "open" || filter === "pending" || filter === "resolved") {
    conditions.push(eq(contacts.status, filter))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [ticketRows, countResult] = await Promise.all([
    db
      .select()
      .from(contacts)
      .where(where)
      .orderBy(desc(contacts.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ total: sql<number>`count(*)` })
      .from(contacts)
      .where(where)
      .then((r) => Number(r[0].total)),
  ])

  const [openCount, pendingCount, resolvedCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(and(where, eq(contacts.status, "open")))
      .then((r) => Number(r[0].count)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(and(where, eq(contacts.status, "pending")))
      .then((r) => Number(r[0].count)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(and(where, eq(contacts.status, "resolved")))
      .then((r) => Number(r[0].count)),
  ])

  return {
    tickets: ticketRows.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() })),
    total: countResult,
    open: openCount,
    pending: pendingCount,
    resolved: resolvedCount,
    page,
    pageSize,
    totalPages: Math.ceil(countResult / pageSize),
  }
}

export async function updateTicketStatus(id: string, status: "open" | "pending" | "resolved") {
  const [updated] = await db
    .update(contacts)
    .set({ status })
    .where(eq(contacts.id, id))
    .returning()

  if (!updated) {
    throw new Error("Ticket not found")
  }

  return updated
}

export async function deleteTicket(id: string) {
  const [deleted] = await db
    .delete(contacts)
    .where(eq(contacts.id, id))
    .returning()

  if (!deleted) {
    throw new Error("Ticket not found")
  }

  return { success: true }
}
