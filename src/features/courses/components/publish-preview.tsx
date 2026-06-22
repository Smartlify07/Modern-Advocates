"use client"

import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"
import { BookOpenIcon, ClockIcon, LayersIcon, TagIcon } from "lucide-react"

export function PublishPreview() {
  const title = useCourseFormStore((s) => s.title)
  const categoryName = useCourseFormStore((s) => s.categoryName)
  const description = useCourseFormStore((s) => s.description)
  const level = useCourseFormStore((s) => s.level)
  const modules = useCourseFormStore((s) => s.modules)
  const price = useCourseFormStore((s) => s.price)
  const discount = useCourseFormStore((s) => s.discount)
  const isFree = useCourseFormStore((s) => s.isFree)
  const thumbnailPreview = useCourseFormStore((s) => s.thumbnailPreview)

  const topicCount = modules.reduce((acc, m) => acc + m.topics.length, 0)
  const numericPrice = isFree ? 0 : parseFloat(price) || 0
  const salePrice = numericPrice * (1 - discount / 100)

  return (
    <Card className="ring-0">
      <CardHeader><CardTitle>Course Summary</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {thumbnailPreview ? (
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted/30">
              <img src={thumbnailPreview} alt="Course thumbnail" className="size-full object-cover" />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              <span className="text-sm text-muted-foreground">No thumbnail</span>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">{title || "Untitled Course"}</h3>
            {categoryName && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <TagIcon className="size-3.5" />
                {categoryName}
              </p>
            )}
          </div>

          {level && (
            <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-medium capitalize">
              {level}
            </span>
          )}

          {description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          )}

          <Separator />

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <LayersIcon className="size-4" />
              {modules.length} {modules.length === 1 ? "module" : "modules"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpenIcon className="size-4" />
              {topicCount} {topicCount === 1 ? "topic" : "topics"}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-4" />
              TBD
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            {isFree ? (
              <span className="text-sm font-semibold text-green-600">Free</span>
            ) : numericPrice > 0 ? (
              <div className="text-right">
                <span className="text-sm font-semibold">${salePrice.toFixed(2)}</span>
                {discount > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    ${numericPrice.toFixed(2)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Not set</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
