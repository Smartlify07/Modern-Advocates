"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  UsersIcon,
  BookOpenIcon,
  HandCoinsIcon,
  ShoppingCartIcon,
  MoreHorizontalIcon,
  EyeIcon,
  BanIcon,
  Trash2Icon,
} from "lucide-react"

const kpiData = [
  { title: "Users", value: "2,340", change: "+12.5%", icon: UsersIcon },
  { title: "Courses", value: "145", change: "+8.2%", icon: BookOpenIcon },
  { title: "Donation", value: "$12,800", change: "+23.1%", icon: HandCoinsIcon },
  { title: "Sales", value: "$45,200", change: "+15.3%", icon: ShoppingCartIcon },
]

const users = [
  {
    name: "Jerome Bell",
    email: "jerome.bell@example.com",
    course: "UI/UX Design",
    status: "Active" as const,
    lastLogin: "2 hours ago",
    avatar: "JB",
  },
  {
    name: "Marvin McKinney",
    email: "marvin.m@example.com",
    course: "Web Development",
    status: "Active" as const,
    lastLogin: "1 day ago",
    avatar: "MM",
  },
  {
    name: "Eleanor Pena",
    email: "eleanor.pena@example.com",
    course: "Data Science",
    status: "Inactive" as const,
    lastLogin: "3 days ago",
    avatar: "EP",
  },
  {
    name: "Dianne Russell",
    email: "dianne.r@example.com",
    course: "Digital Marketing",
    status: "Active" as const,
    lastLogin: "5 hours ago",
    avatar: "DR",
  },
  {
    name: "Cody Fisher",
    email: "cody.fisher@example.com",
    course: "Mobile Development",
    status: "Active" as const,
    lastLogin: "1 week ago",
    avatar: "CF",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button className="rounded-(--radius-button-medium) bg-purple-600 text-white hover:bg-purple-700">
          See all
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} size="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50">
                  <kpi.icon className="size-4 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="mt-1 text-xs text-emerald-600">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course Enrolled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
                        {user.avatar}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{user.course}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                          <EyeIcon className="size-4" />
                          View user
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BanIcon className="size-4" />
                          Suspend user
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2Icon className="size-4" />
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
