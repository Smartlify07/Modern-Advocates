"use client"

import {
  UsersIcon,
  BookAudio,
  GiftIcon,
  ShoppingBag,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { Skeleton } from "@/shared/ui/skeleton"
import { StatCard } from "./stat-card"
import { Button } from "@/shared/ui/button"
import {
  ErrorState,
  ErrorStateTitle,
  ErrorStateAction,
} from "@/shared/ui/error-state"

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
  {
    title: "Courses",
    valueKey: "courses",
    changeKey: "courses",
    icon: BookAudio,
  },
  {
    title: "Donation",
    valueKey: "donations",
    changeKey: "donations",
    prefix: "$",
    icon: GiftIcon,
  },
  {
    title: "Sales",
    valueKey: "revenue",
    changeKey: "sales",
    prefix: "$",
    icon: ShoppingBag,
  },
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
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

export function KpiCards({ role }: KpiCardsProps) {
  const { data, isLoading, isError, refetch } = useQuery<DashboardStats>({
    queryKey: queryKeys.admin.dashboardStats,
    queryFn: () => apiFetch<DashboardStats>("/api/admin/dashboard"),
  })

  if (isLoading) return <SkeletonCards />
  if (isError || !data)
    return (
      <ErrorState className="rounded-lg border border-red-200 bg-red-50 py-12">
        <AlertCircleIcon className="size-8 text-red-500" />
        <ErrorStateTitle className="text-sm font-normal text-red-600">
          Failed to load dashboard stats
        </ErrorStateTitle>
        <ErrorStateAction>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCwIcon className="size-4" />
            Try again
          </Button>
        </ErrorStateAction>
      </ErrorState>
    )

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
