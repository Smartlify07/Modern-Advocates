import { NextResponse, type NextRequest } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { UnauthorizedError, ForbiddenError } from "@/infrastructure/auth/errors"
import { ApiError } from "@/shared/lib/api-fetch"

type RouteParams = Promise<Record<string, string | string[]>>

type ApiRouteContext = { params: RouteParams }

export function apiHandler<P extends ApiRouteContext>(
  handler: (request: NextRequest, ctx: P) => Promise<NextResponse>
) {
  return async (request: NextRequest, ctx: P): Promise<NextResponse> => {
    try {
      return await handler(request, ctx)
    } catch (error) {
      const digest = (error as { digest?: string })?.digest
      if (
        digest?.startsWith("NEXT_REDIRECT") ||
        digest?.startsWith("NEXT_NOT_FOUND")
      ) {
        throw error
      }
      if (error instanceof UnauthorizedError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        )
      }
      if (error instanceof ForbiddenError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        )
      }
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        )
      }
      Sentry.captureException(error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}
