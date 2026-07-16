"use client"

import { KpiSection } from "@/features/admin/products/components/kpi-section"
import { SalesSection } from "@/features/admin/products/components/sales-section"
import { ProductListSection } from "@/features/admin/products/components/product-list-section"
import { sampleProducts } from "@/features/admin/products/types"

export default function AdminProductsPage() {
  return (
    <div className="mx-auto flex flex-col gap-7.5 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-semibold tracking-[-3%]">Products</h1>
        <KpiSection />
      </div>
      <SalesSection />
      <ProductListSection products={sampleProducts} />
    </div>
  )
}
