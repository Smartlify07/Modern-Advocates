import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/infrastructure/auth/helpers"
import { listSupportTickets } from "@/features/admin/support/services/support-service"
import type { ListSupportTicketsParams } from "@/features/admin/support/types"
import { apiHandler } from "@/shared/lib/api-handler"

export const GET = apiHandler(async (request: NextRequest) => {
  await requireAdmin()

  const { searchParams } = request.nextUrl
  const params: ListSupportTicketsParams = {
    search: searchParams.get("search") ?? undefined,
    filter: searchParams.get("filter") ?? undefined,
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  }

  const result = await listSupportTickets(params)
  return NextResponse.json(result)
})
