import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import {
  listUsers,
  createUser,
} from "@/features/admin/users/services/user-service"
import * as Sentry from "@sentry/nextjs"
import type { ListUsersParams } from "@/features/admin/users/services/user-service"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = request.nextUrl
    const params: ListUsersParams = {
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    }

    const result = await listUsers(params)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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
    await requireAdmin()

    const body = await request.json()
    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    const newUser = await createUser({
      name: body.name.trim(),
      email: body.email.trim(),
    })
    return NextResponse.json(newUser, { status: 201 })
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
