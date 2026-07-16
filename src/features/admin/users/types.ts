export interface User {
  id: string
  name: string
  email: string
  courseEnrolled: number
  status: "active" | "suspended"
  lastLogin: string
  createdAt: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  pageSize: number
}
