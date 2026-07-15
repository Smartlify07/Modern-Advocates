import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactValue(value: number, prefix?: string): string {
  if (value >= 1_000_000_000) {
    return `${prefix ?? ""}${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`
  }
  if (value >= 1_000_000) {
    return `${prefix ?? ""}${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (value >= 100_000) {
    return `${prefix ?? ""}${(value / 1_000).toFixed(0)}k`
  }
  if (value >= 1_000) {
    return `${prefix ?? ""}${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return `${prefix ?? ""}${value.toLocaleString()}`
}
