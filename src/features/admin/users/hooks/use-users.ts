"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { User, UsersResponse } from "@/features/admin/users/types"

interface UseUsersParams {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export function useUsers({ search, status, page = 1, pageSize = 10 }: UseUsersParams) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (status && status !== "all") params.set("status", status)
  params.set("page", String(page))
  params.set("pageSize", String(pageSize))

  return useQuery<UsersResponse>({
    queryKey: ["admin-users", { search, status, page, pageSize }],
    queryFn: () => fetch(`/api/admin/users?${params}`).then((r) => r.json()),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string }) =>
      fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      fetch(`/api/admin/users/${userId}/suspend`, { method: "PATCH" }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      fetch(`/api/admin/users/${userId}/activate`, { method: "PATCH" }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      fetch(`/api/admin/users/${userId}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  })
}
