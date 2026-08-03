import { NextResponse, type NextRequest } from "next/server"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { updateTicketStatus, deleteTicket } from "@/features/admin/support/services/support-service"
import { apiHandler } from "@/shared/lib/api-handler"
import { ApiError } from "@/shared/lib/api-fetch"

async function toTicketNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise
  } catch (error) {
    if (error instanceof Error && error.message === "Ticket not found") {
      throw new ApiError("Ticket not found", 404)
    }
    throw error
  }
}

export const PATCH = apiHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    await requireAdmin()
    const { id } = await params
    const { status } = await request.json()
    if (!status || typeof status !== "string") {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }
    const updated = await toTicketNotFound(updateTicketStatus(id, status as "open" | "pending" | "resolved"))
    return NextResponse.json(updated)
  },
)

export const DELETE = apiHandler(
  async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    await requireAdmin()
    const { id } = await params
    const result = await toTicketNotFound(deleteTicket(id))
    return NextResponse.json(result)
  },
)
