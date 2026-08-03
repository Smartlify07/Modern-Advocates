import type { ReactNode } from "react"
import { cn } from "@/shared/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: "left" | "center"
  className?: string
  eyebrowClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-base leading-normal font-medium tracking-[0.1em] text-muted-foreground uppercase",
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-ma-text sm:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-normal text-ma-text/70 lg:text-lg",
            align === "center" && "mx-auto",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}