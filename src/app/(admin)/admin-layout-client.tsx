"use client"

import { SidebarNavigation } from "@/features/platform/components/sidebar-navigation"
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"
import { TooltipProvider } from "@/shared/ui/tooltip"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import {
  BellIcon,
  SearchIcon,
  UserCircle2,
} from "lucide-react"
export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <SidebarNavigation />
        <SidebarInset>
          <header className="border-b px-7.5 py-4">
            <div className="mx-auto flex shrink-0 items-center justify-between gap-2 lg:max-w-7xl 2xl:max-w-360">
              <div className="flex items-center gap-4">
                <div className="relative w-[417px]">
                  <SearchIcon
                    strokeWidth={1.5}
                    className="absolute start-4 top-1/2 size-5.5 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search for anything..."
                    className="h-[44px] rounded-button-medium bg-[#f5f5f5] px-14 text-sm placeholder:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon
                    stroke="#6B7280"
                    strokeWidth={1.5}
                    className="size-5"
                  />
                  <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-[#D8727D]" />
                </Button>
                <UserCircle2 stroke="#6B7280" strokeWidth={1.5} />
                <h2 className="text-primary">Admin</h2>
              </div>
            </div>
          </header>
          <div className="">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
