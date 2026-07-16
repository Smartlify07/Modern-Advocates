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
  UserCheckIcon,
  Trash2Icon,
  User,
} from "lucide-react"
import type { User as UserType } from "@/features/admin/users/types"

interface UserTableProps {
  users: UserType[]
  onSuspend: (user: UserType) => void
  onActivate: (user: UserType) => void
  onDelete: (user: UserType) => void
}

export function UserTable({ users, onSuspend, onActivate, onDelete }: UserTableProps) {
  return (
    <div className="rounded-t-2xl">
      <Table>
        <TableHeader className="rounded-t-2xl">
          <TableRow className="rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]">
            <TableHead className="w-[220px]">User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Course Enrolled</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow className="hover:bg-[#F5F7FA]" key={user.id}>
              <TableCell>
                <span className="font-normal">{user.name}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell className="text-center">
                {user.courseEnrolled}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    user.status === "active"
                      ? "bg-green-700/10 text-green-700"
                      : "bg-amber-100 text-amber-800",
                    "rounded-[8px] font-normal"
                  )}
                >
                  {user.status === "active" ? "Active" : "Suspended"}
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
                      {user.status === "active" ? (
                        <DropdownMenuItem
                          className="gap-2.5 p-2"
                          onSelect={() => onSuspend(user)}
                        >
                          <BanIcon strokeWidth={1.5} className="size-4" />
                          Suspend user
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="gap-2.5 p-2"
                          onSelect={() => onActivate(user)}
                        >
                          <UserCheckIcon strokeWidth={1.5} className="size-4" />
                          Reactivate user
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <Separator className="my-1.5" />
                    <DropdownMenuItem
                      className="gap-2.5 p-2"
                      variant="destructive"
                      onSelect={() => onDelete(user)}
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
