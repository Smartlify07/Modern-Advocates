export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Editor"
  status: "Active"
  lastLogin: string
}
