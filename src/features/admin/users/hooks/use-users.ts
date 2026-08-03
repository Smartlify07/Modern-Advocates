"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import type { User, UsersResponse } from "@/features/admin/users/types"
import type { CreateUserParams } from "@/features/admin/users/services/user-service"

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
    queryKey: queryKeys.admin.users.list({ search, status, page, pageSize }),
    queryFn: () => apiFetch<UsersResponse>(`/api/admin/users?${params}`),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserParams) =>
      apiFetch("/api/admin/users", {
        method: "POST",
        body: data,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all }),
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/api/admin/users/${userId}/suspend`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all }),
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/api/admin/users/${userId}/activate`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/api/admin/users/${userId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all }),
  })
}
