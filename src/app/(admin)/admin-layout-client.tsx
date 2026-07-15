"use client"

import { AppSidebar } from "@/features/platform/components/app-sidebar"
import type { NavSection } from "@/features/platform/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar"
import { TooltipProvider } from "@/shared/ui/tooltip"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import {
  BellIcon,
  SearchIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  UsersIcon,
  PackageIcon,
  BriefcaseIcon,
} from "lucide-react"

const adminNavSections: NavSection[] = [
  {
    label: "Main",
    items: [
      { title: "Home", url: "/admin/dashboard", icon: LayoutDashboardIcon },
      { title: "Courses", url: "/admin/courses", icon: BookOpenIcon },
      { title: "Users", url: "/admin/users", icon: UsersIcon },
      { title: "Products", url: "/admin/products", icon: PackageIcon },
    ],
  },
  {
    label: "Business",
    items: [
      { title: "Analytics", url: "/admin/analytics", icon: BriefcaseIcon },
      { title: "Finance", url: "/admin/finance", icon: BriefcaseIcon },
      { title: "Reports", url: "/admin/reports", icon: BriefcaseIcon },
    ],
  },
]

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar navSections={adminNavSections} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ms-1" />
              <div className="relative w-64">
                <SearchIcon className="absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="ps-8" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="size-5" />
                <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-red-500" />
              </Button>
              <Avatar className="size-8">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
