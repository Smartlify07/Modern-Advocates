import Link from "next/link"

export default function ProductSalesNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-4xl font-bold text-ma-text lg:text-5xl">
        Product not found
      </h2>
      <p className="text-[#6b7280]">
        The sales page for this product doesn't exist or has been removed.
      </p>
      <Link
        href="/admin/products"
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
      >
        Back to products
      </Link>
    </div>
  )
}
