"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutGrid,
  PlayCircle,
  Users,
  ShoppingBag,
  Gift,
  UserPlus,
  MessageSquareMore,
  LogOut,
} from "lucide-react"
import { cn } from "@/shared/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/ui/sidebar"
import { Separator } from "@/shared/ui/separator"

export function SidebarNavigation({
  role,
  ...props
}: React.ComponentProps<typeof Sidebar> & { role?: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const sidebar = useSidebar()

  const isActive = (url: string) => {
    if (url === "/admin") return pathname === "/admin"
    return pathname === url || pathname.startsWith(url + "/")
  }

  const mainNavItems = [
    { title: "Home", url: "/admin", icon: LayoutGrid },
    { title: "Courses", url: "/admin/courses", icon: PlayCircle },
    { title: "Users", url: "/admin/users", icon: Users },
    ...(role === "admin" || role === "manager"
      ? [{ title: "Products", url: "/admin/products", icon: ShoppingBag }]
      : []),
  ]

  const businessNavItems = [
    ...(role === "admin" || role === "manager"
      ? [{ title: "Donations", url: "/admin/donations", icon: Gift }]
      : []),
    { title: "Team", url: "/admin/team", icon: UserPlus },
    { title: "Help & Support", url: "/admin/help", icon: MessageSquareMore },
  ]

  const handleLogout = () => {
    router.push("/auth/signout")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-purple-100">
                  <div className="flex size-5 items-center justify-center rounded-full bg-purple-300">
                    <div className="size-2.5 rounded-full bg-purple-600" />
                  </div>
                </div>
                <div className="text-base font-bold tracking-tight">
                  ModernAdv.Inc
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-6">
        <SidebarGroup
          className={cn(sidebar.state === "collapsed" ? "px-2" : "px-4")}
        >
          <SidebarMenu className="space-y-2">
            {mainNavItems.map((item) => {
              const active = isActive(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 rounded-[8px] px-2.5 py-2! text-lg text-[#6B7280] hover:bg-ma-admin-primary/10 hover:text-primary [&_svg]:hover:text-ma-admin-primary",
                      active && "bg-[#F1EEFD] font-semibold text-primary"
                    )}
                    asChild
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="py-2!">
                      <item.icon
                        className={cn(
                          active && "text-ma-admin-primary",
                          "size-4"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
          <Separator className="mt-4" />
        </SidebarGroup>

        <SidebarGroup
          className={cn(sidebar.state === "collapsed" ? "px-2" : "gap-5 px-4")}
        >
          <SidebarGroupLabel className="text-base font-semibold text-primary uppercase">
            Business
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            {businessNavItems.map((item) => {
              const active = isActive(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 rounded-[8px] px-2.5 py-2! text-lg text-[#6B7280] hover:bg-ma-admin-primary/10 hover:text-primary [&_svg]:hover:text-ma-admin-primary",
                      active && "bg-[#F1EEFD] font-semibold text-primary"
                    )}
                    asChild
                    tooltip={item.title}
                  >
                    <Link href={item.url} className="py-2!">
                      <item.icon
                        className={cn(
                          active && "text-ma-admin-primary",
                          "size-4"
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(sidebar.state === "collapsed" ? "px-2" : "px-4")}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Log out"
              className="h-10 text-lg text-red-500 hover:bg-red-50 hover:text-red-500!"
            >
              <button onClick={handleLogout} type="button">
                <LogOut className="size-4" />
                <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
