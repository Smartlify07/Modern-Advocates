import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import {
  listTeamMembers,
  addTeamMember,
} from "@/features/admin/team/services/team-service"
import * as Sentry from "@sentry/nextjs"
import type { ListTeamMembersParams } from "@/features/admin/team/services/team-service"

export async function GET(request: NextRequest) {
  try {
    const { user: currentUser } = await requireAdmin()

    const { searchParams } = request.nextUrl
    const params: ListTeamMembersParams = {
      search: searchParams.get("search") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    }

    const result = await listTeamMembers(params)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    Sentry.captureException(error)
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { user: currentUser } = await requireAdmin()

    const body = await request.json()
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    if (!body.role || !["Admin", "Manager", "Editor"].includes(body.role)) {
      return NextResponse.json(
        { error: "Valid role is required (Admin, Manager, or Editor)" },
        { status: 400 }
      )
    }

    const member = await addTeamMember({
      email: body.email.trim(),
      role: body.role,
      invitedById: currentUser.id,
    })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
