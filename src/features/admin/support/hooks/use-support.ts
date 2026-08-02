"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiFetch } from "@/shared/lib/api-fetch"
import type { ListSupportTicketsResult } from "@/features/admin/support/services/support-service"

export function useSupportTickets(
  params: { search?: string; filter?: string; page?: number; pageSize?: number } = {},
) {
  const queryString = new URLSearchParams()
  if (params.search) queryString.set("search", params.search)
  if (params.filter) queryString.set("filter", params.filter)
  if (params.page) queryString.set("page", String(params.page))
  if (params.pageSize) queryString.set("pageSize", String(params.pageSize))

  return useQuery<ListSupportTicketsResult>({
    queryKey: ["admin-support", params],
    queryFn: () => apiFetch<ListSupportTicketsResult>(`/api/admin/support?${queryString.toString()}`),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/api/admin/support/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-support"] }),
    onError: (err) => {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to update ticket status")
    },
  })
}

export function useDeleteTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/support/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-support"] }),
    onError: (err) => {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to delete ticket")
    },
  })
}
