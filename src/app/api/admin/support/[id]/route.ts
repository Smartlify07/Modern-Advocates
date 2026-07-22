import { NextResponse } from "next/server"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { updateTicketStatus, deleteTicket } from "@/features/admin/support/services/support-service"
import * as Sentry from "@sentry/nextjs"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin()
    const { id } = await params
    const { status } = await request.json()
    if (!status || typeof status !== "string") {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }
    const updated = await updateTicketStatus(id, status as "open" | "pending" | "resolved")
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (error instanceof Error && error.message === "Ticket not found") {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin()
    const { id } = await params
    const result = await deleteTicket(id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (error instanceof Error && error.message === "Ticket not found") {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
