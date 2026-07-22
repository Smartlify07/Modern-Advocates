"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ListSupportTicketsResult } from "@/features/admin/support/services/support-service"

export function useSupportTickets() {
  return useQuery<ListSupportTicketsResult>({
    queryKey: ["admin-support"],
    queryFn: () =>
      fetch("/api/admin/support?pageSize=1000").then((r) => {
        if (!r.ok) throw new Error("Failed to fetch support tickets")
        return r.json()
      }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/admin/support/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to update ticket status")
        return r.json()
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
      fetch(`/api/admin/support/${id}`, {
        method: "DELETE",
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to delete ticket")
        return r.json()
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-support"] }),
    onError: (err) => {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Failed to delete ticket")
    },
  })
}
