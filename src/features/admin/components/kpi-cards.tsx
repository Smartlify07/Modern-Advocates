"use client"

import { useEffect, useState, useCallback } from "react"
import {
  UsersIcon,
  BookAudio,
  GiftIcon,
  ShoppingBag,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react"
import { Skeleton } from "@/shared/ui/skeleton"
import { StatCard } from "./stat-card"
import { Button } from "@/shared/ui/button"

interface DashboardStats {
  users: number
  courses: number
  donations: number
  sales: number
  revenue: number
  changes: {
    users: string
    courses: string
    donations: string
    sales: string
  }
}

type NumericKeys = {
  [K in keyof DashboardStats]: DashboardStats[K] extends number ? K : never
}[keyof DashboardStats]

interface KpiDef {
  title: string
  icon: typeof UsersIcon
  valueKey: NumericKeys
  changeKey: keyof DashboardStats["changes"]
  prefix?: string
}

const kpiDefs: KpiDef[] = [
  { title: "Users", valueKey: "users", changeKey: "users", icon: UsersIcon },
  { title: "Courses", valueKey: "courses", changeKey: "courses", icon: BookAudio },
  { title: "Donation", valueKey: "donations", changeKey: "donations", prefix: "$", icon: GiftIcon },
  { title: "Sales", valueKey: "revenue", changeKey: "sales", prefix: "$", icon: ShoppingBag },
]

interface KpiCardsProps {
  role?: string | null
}

const hiddenForEditor = new Set(["Donation", "Sales"])

function SkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-5">
          <Skeleton className="mb-3 h-4 w-16" />
          <Skeleton className="mb-2 h-8 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 py-12">
      <AlertCircleIcon className="size-8 text-red-500" />
      <p className="text-sm text-red-600">Failed to load dashboard stats</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCwIcon className="size-4" />
        Try again
      </Button>
    </div>
  )
}

export function KpiCards({ role }: KpiCardsProps) {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchStats = useCallback(() => {
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((json: DashboardStats) => {
        setData(json)
        setIsLoading(false)
      })
      .catch(() => {
        setError(true)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (isLoading) return <SkeletonCards />
  if (error || !data) return <ErrorState onRetry={fetchStats} />

  const showAll = role === "admin" || role === "manager"
  const visible = showAll
    ? kpiDefs
    : kpiDefs.filter((k) => !hiddenForEditor.has(k.title))

  const gridCols = Math.min(visible.length, 4)

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${gridCols}`}>
      {visible.map((kpi) => (
        <StatCard
          key={kpi.title}
          title={kpi.title}
          value={data[kpi.valueKey]}
          prefix={kpi.prefix}
          change={data.changes[kpi.changeKey]}
          icon={kpi.icon}
        />
      ))}
    </div>
  )
}
