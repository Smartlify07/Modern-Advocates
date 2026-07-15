"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { KpiCards } from "@/features/admin/components/kpi-cards"
import { UserTable } from "@/features/admin/components/user-table"

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl/[100%] font-semibold tracking-[-3%]">
            Dashboard
          </h1>
        </div>

        <KpiCards />
      </div>

      <div className="flex flex-col gap-8">
        <CardTitle className="text-2xl/[24px] font-bold">User List</CardTitle>
        <UserTable />
      </div>
    </div>
  )
}
