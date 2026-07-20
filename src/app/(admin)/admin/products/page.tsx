"use client"

import { useQuery } from "@tanstack/react-query"
import { KpiSection } from "@/features/admin/products/components/kpi-section"
import { SalesSection } from "@/features/admin/products/components/sales-section"
import { ProductListSection } from "@/features/admin/products/components/product-list-section"
import type { Product, SalesSummary, ChartDataPoint } from "@/features/admin/products/types"

export default function AdminProductsPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: () => fetch("/api/admin/products").then((r) => r.json()),
  })

  return (
    <div className="mx-auto flex flex-col gap-7.5 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-semibold tracking-[-3%]">Products</h1>
        <KpiSection
          totalProducts={products.length}
          totalSales={products.reduce((s, p) => s + p.sales, 0)}
        />
      </div>
      <SalesSection />
      <ProductListSection products={products} />
    </div>
  )
}
