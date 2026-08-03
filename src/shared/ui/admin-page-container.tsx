import type { ReactNode } from "react"
import { cn } from "@/shared/utils"

interface AdminPageContainerProps {
  children: ReactNode
  className?: string
}

export function AdminPageContainer({ children, className }: AdminPageContainerProps) {
  return (
    <div className={cn("mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360", className)}>
      {children}
    </div>
  )
}