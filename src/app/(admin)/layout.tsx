"use client"

import { Fragment } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { AppSidebar } from "@/features/platform/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar"
import { TooltipProvider } from "@/shared/ui/tooltip"
import { Separator } from "@/shared/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react"
import type { NavItem } from "@/features/platform/components/app-sidebar"

const adminNavItems: NavItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboardIcon },
  { title: "Courses", url: "/admin/courses", icon: BookOpenIcon },
  { title: "Users", url: "/admin/users", icon: UsersIcon },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
]

const breadcrumbLabels: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  courses: "Courses",
  users: "Users",
  settings: "Settings",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  const navItems = adminNavItems

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar navItems={navItems} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ms-1" />
              <Separator
                orientation="vertical"
                className="me-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/")
                    const label =
                      breadcrumbLabels[segment] ??
                      segment.charAt(0).toUpperCase() + segment.slice(1)
                    const isLast = index === segments.length - 1

                    return (
                      <Fragment key={href}>
                        {index > 0 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={href}>{label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
