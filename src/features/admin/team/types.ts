export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Editor"
  status: "Active"
  lastLogin: string
}

export const mockMembers: TeamMember[] = [
  { id: "1", name: "Ronald Richards", email: "ronald@gmail.com", role: "Admin", status: "Active", lastLogin: "Dec 12, 2025" },
  { id: "2", name: "Jacob Jones", email: "jacob@gmail.com", role: "Manager", status: "Active", lastLogin: "Dec 5, 2025" },
  { id: "3", name: "Arlene McCoy", email: "arlene@gmail.com", role: "Editor", status: "Active", lastLogin: "Nov 28, 2025" },
]
