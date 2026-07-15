import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Separator } from "@/shared/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { cn } from "@/shared/utils"
import {
  MoreHorizontalIcon,
  EyeIcon,
  BanIcon,
  Trash2Icon,
  User,
} from "lucide-react"

interface User {
  name: string
  email: string
  course: string
  status: "Active" | "Inactive"
  lastLogin: string
  avatar: string
}

const users: User[] = [
  {
    name: "Jerome Bell",
    email: "jerome.bell@example.com",
    course: "UI/UX Design",
    status: "Active",
    lastLogin: "2 hours ago",
    avatar: "JB",
  },
  {
    name: "Marvin McKinney",
    email: "marvin.m@example.com",
    course: "Web Development",
    status: "Active",
    lastLogin: "1 day ago",
    avatar: "MM",
  },
  {
    name: "Eleanor Pena",
    email: "eleanor.pena@example.com",
    course: "Data Science",
    status: "Inactive",
    lastLogin: "3 days ago",
    avatar: "EP",
  },
  {
    name: "Dianne Russell",
    email: "dianne.r@example.com",
    course: "Digital Marketing",
    status: "Active",
    lastLogin: "5 hours ago",
    avatar: "DR",
  },
  {
    name: "Cody Fisher",
    email: "cody.fisher@example.com",
    course: "Mobile Development",
    status: "Active",
    lastLogin: "1 week ago",
    avatar: "CF",
  },
]

export function UserTable() {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead className="w-[220px]">User</TableHead>
            <TableHead className="]">Email</TableHead>
            <TableHead className="text-center">Course Enrolled</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Last Login</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow className="hover:bg-[#F5F7FA]" key={user.email}>
              <TableCell>
                <span className="font-normal">{user.name}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell className="text-center">
                {user.course.length}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    `${
                      user.status === "Active"
                        ? "bg-green-700/10 text-green-700"
                        : "bg-destructive/10 text-destructive"
                    } rounded-[8px] font-normal`
                  )}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.lastLogin}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ring- size-6 rounded-full border border-[#141B34]"
                    >
                      <MoreHorizontalIcon className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="gap-2.5 p-2">
                        <User strokeWidth={1.5} className="size-4" />
                        View user
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2.5 p-2">
                        <BanIcon strokeWidth={1.5} className="size-4" />
                        Suspend user
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <Separator className="my-1.5" />
                    <DropdownMenuItem
                      className="gap-2.5 p-2"
                      variant="destructive"
                    >
                      <Trash2Icon strokeWidth={1.5} className="size-4" />
                      Delete user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
