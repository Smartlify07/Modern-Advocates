import {
  UsersIcon,
  BookOpenIcon,
  HandCoinsIcon,
  ShoppingCartIcon,
  BookAudio,
  GiftIcon,
  ShoppingBag,
} from "lucide-react"
import { StatCard } from "./stat-card"

const kpiData = [
  { title: "Users", value: 2340, change: "+12.5%", icon: UsersIcon },
  { title: "Courses", value: 145, change: "+8.2%", icon: BookAudio },
  { title: "Donation", value: 12800, prefix: "$", change: "+23.1%", icon: GiftIcon },
  { title: "Sales", value: 45200, prefix: "$", change: "+15.3%", icon: ShoppingBag },
]

export function KpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <StatCard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
