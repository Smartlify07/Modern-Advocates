import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { validate as isValidUuid } from "uuid"

export { isValidUuid }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactValue(value: number, prefix?: string): string {
  if (value >= 100_000) {
    const suffix = value >= 1_000_000_000 ? "B" : value >= 1_000_000 ? "M" : "k"
    const divisor =
      suffix === "B" ? 1_000_000_000 : suffix === "M" ? 1_000_000 : 1_000
    const formatted = (value / divisor)
      .toFixed(suffix === "k" ? 0 : 1)
      .replace(/\.0$/, "")
    return `${prefix ?? ""}${formatted}${suffix}`
  }
  return `${prefix ?? ""}${value.toLocaleString()}`
}
