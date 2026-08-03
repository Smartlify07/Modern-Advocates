"use client"

import { useState } from "react"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import type { AdminRole, CreateUserParams } from "@/features/admin/users/services/user-service"

export const CREATE_USER_FORM_ID = "create-user-form"

interface CreateUserFormProps {
  onSubmit: (data: CreateUserParams) => void
  isPending?: boolean
  defaultRole?: AdminRole
}

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "editor", label: "Editor" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
]

export function CreateUserForm({
  onSubmit,
  isPending = false,
  defaultRole = "user",
}: CreateUserFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<AdminRole>(defaultRole)
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || isPending) return
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
      password: password.trim() ? password : undefined,
    })
    setName("")
    setEmail("")
    setRole(defaultRole)
    setPassword("")
  }

  return (
    <form id={CREATE_USER_FORM_ID} onSubmit={handleSubmit} className="space-y-7.5">
      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
        className="h-pill p-5"
      />
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        className="h-pill p-5"
      />
      <Select value={role} onValueChange={(value) => setRole(value as AdminRole)} disabled={isPending}>
        <SelectTrigger className="h-pill w-full p-5">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Password (optional)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isPending}
        className="h-pill p-5"
      />
    </form>
  )
}