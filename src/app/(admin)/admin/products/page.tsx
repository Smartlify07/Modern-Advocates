"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/shared/lib/api-fetch"
import { queryKeys } from "@/shared/lib/query-keys"
import { KpiSection } from "@/features/admin/products/components/kpi-section"
import { SalesSection } from "@/features/admin/products/components/sales-section"
import { ProductListSection } from "@/features/admin/products/components/product-list-section"
import { KpiSectionSkeleton, ProductListSectionSkeleton } from "@/features/admin/products/components/products-skeleton"
import type { Product } from "@/features/admin/products/types"
import { AdminPageContainer } from "@/shared/ui/admin-page-container"
import { PageHeader } from "@/shared/ui/page-header"

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: queryKeys.admin.products,
    queryFn: () => apiFetch<Product[]>("/api/admin/products"),
  })

  return (
    <AdminPageContainer className="gap-7.5">
      <div className="flex flex-col gap-5">
        <PageHeader title="Products" />
        {isLoading ? (
          <KpiSectionSkeleton />
        ) : (
          <KpiSection
            totalProducts={products.length}
            totalSales={products.reduce((s, p) => s + p.sales, 0)}
          />
        )}
      </div>
      <SalesSection />
      {isLoading ? <ProductListSectionSkeleton /> : <ProductListSection products={products} />}
    </AdminPageContainer>
  )
}
