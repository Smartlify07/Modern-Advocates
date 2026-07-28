export interface TeamMember {
  id: string
  name: string | null
  email: string
  role: "Admin" | "Manager" | "Editor"
  status: "Active" | "Pending"
  lastLogin: string | null
}
