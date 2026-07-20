const ADMIN_ROLES = ["admin", "manager", "editor"] as const

export function isAdminRole(role: string | null | undefined) {
  return role != null && ADMIN_ROLES.includes(role as typeof ADMIN_ROLES[number])
}

export function isManagerOrAdmin(role: string | null | undefined) {
  return role === "admin" || role === "manager"
}
