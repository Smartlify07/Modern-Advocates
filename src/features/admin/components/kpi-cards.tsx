import {
  UsersIcon,
  BookOpenIcon,
  HandCoinsIcon,
  ShoppingCartIcon,
  BookAudio,
  GiftIcon,
  ShoppingBag,
} from "lucide-react"
import { Skeleton } from "@/shared/ui/skeleton"
import { StatCard } from "./stat-card"

const kpiData = [
  { title: "Users", value: 2340, change: "+12.5%", icon: UsersIcon },
  { title: "Courses", value: 145, change: "+8.2%", icon: BookAudio },
  {
    title: "Donation",
    value: 128000,
    prefix: "$",
    change: "+23.1%",
    icon: GiftIcon,
  },
  {
    title: "Sales",
    value: 45200,
    prefix: "$",
    change: "+15.3%",
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
          <Skeleton className="mb-2 h-8 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

export function KpiCards({ role }: KpiCardsProps) {
  if (!role) return <SkeletonCards />

  const showAll = role === "admin" || role === "manager"
  const visible = showAll ? kpiData : kpiData.filter((k) => !hiddenForEditor.has(k.title))

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${visible.length}`}>
      {visible.map((kpi) => (
        <StatCard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
