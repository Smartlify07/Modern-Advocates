"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"

interface PaginationBarProps {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, total, pageSize, onPageChange }: PaginationBarProps) {
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const pages: (number | "ellipsis")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push("ellipsis")
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push("ellipsis")
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">Showing {start} &ndash; {end} of {total}</p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => { e.preventDefault(); if (page > 1) onPageChange(page - 1) }}
              className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={(e) => { e.preventDefault(); onPageChange(p) }}
                  className={p === page ? "bg-ma-admin-primary text-white hover:bg-ma-admin-primary/80" : undefined}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => { e.preventDefault(); if (page < totalPages) onPageChange(page + 1) }}
              className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
