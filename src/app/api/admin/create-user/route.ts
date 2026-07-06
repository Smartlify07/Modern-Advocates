import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/infrastructure/auth/auth"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()

    const newUser = await auth.api.createUser({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
        role: "admin",
      },
      headers: await headers(),
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
