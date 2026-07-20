import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

interface PageHeaderProps { title: string; backHref?: string }

export function PageHeader({ title, backHref = "/admin/products" }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Link href={backHref}>
        <ArrowLeftIcon className="size-5 cursor-pointer text-muted-foreground" />
      </Link>
      <h1 className="text-4xl/[100%] font-semibold tracking-[-3%]">{title}</h1>
    </div>
  )
}
