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

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(
  date: string | Date | number | null | undefined,
): string {
  if (!date) return "—"
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDuration(
  minutes: number | null | undefined,
): string {
  if (!minutes || minutes <= 0) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export function formatDurationFromSeconds(
  seconds: number | null | undefined,
): string {
  if (!seconds || seconds <= 0) return ""
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins}mins`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}hr ${m}mins` : `${h}hr`
}

export function formatSecondsClock(
  seconds: number | null | undefined,
): string {
  if (!seconds) return "--:--"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

const statusColorMap: Record<string, string> = {
  active: "bg-green-700/10 text-green-700",
  open: "bg-green-700/10 text-green-700",
  published: "bg-green-700/10 text-green-700",
  live: "bg-green-700/10 text-green-700",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  suspended: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  archived: "bg-slate-100 text-slate-600",
  resolved: "bg-slate-100 text-slate-600",
}

export function getStatusColor(status: string): string {
  return statusColorMap[status.toLowerCase()] ?? "bg-slate-100 text-slate-600"
}
