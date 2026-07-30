import * as React from "react"

import { cn } from "@/shared/utils"

function ErrorState({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20 text-center",
        className
      )}
      {...props}
    />
  )
}

function ErrorStateTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="error-state-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function ErrorStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="error-state-description"
      className={cn("max-w-md text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ErrorStateAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="error-state-action"
      className={cn("mt-2", className)}
      {...props}
    />
  )
}

export {
  ErrorState,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateAction,
}
