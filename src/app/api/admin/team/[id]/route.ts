import { NextResponse } from "next/server"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { updateTeamMemberRole, removeTeamMember } from "@/features/admin/team/services/team-service"
import * as Sentry from "@sentry/nextjs"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()

    if (!body.role || !["Admin", "Manager", "Editor"].includes(body.role)) {
      return NextResponse.json({ error: "Valid role is required (Admin, Manager, or Editor)" }, { status: 400 })
    }

    const member = await updateTeamMemberRole(id, body.role)
    return NextResponse.json(member)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
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
    const result = await removeTeamMember(id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    Sentry.captureException(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
