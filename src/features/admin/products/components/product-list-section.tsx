import { ProductTable } from "./product-table"
import type { Product } from "@/features/admin/products/types"

interface ProductListSectionProps {
  products: Product[]
}

export function ProductListSection({ products }: ProductListSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Product List</h2>
        <span className="cursor-pointer text-lg/[24px] text-[#6B7280] underline underline-offset-2">
          See all
        </span>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
