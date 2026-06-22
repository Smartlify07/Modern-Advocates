"use client"

import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"
import { PublishChecklist } from "./publish-checklist"
import { PublishPreview } from "./publish-preview"
import { PublishActions } from "./publish-actions"

export function PublishSection() {
  const title = useCourseFormStore((s) => s.title)
  const categoryId = useCourseFormStore((s) => s.categoryId)
  const level = useCourseFormStore((s) => s.level)
  const modules = useCourseFormStore((s) => s.modules)
  const price = useCourseFormStore((s) => s.price)
  const discount = useCourseFormStore((s) => s.discount)
  const isFree = useCourseFormStore((s) => s.isFree)
  const thumbnailPreview = useCourseFormStore((s) => s.thumbnailPreview)

  const hasModules = modules.length > 0
  const hasPricing = isFree || (parseFloat(price) || 0) > 0
  const hasThumbnail = !!thumbnailPreview
  const canPublish = !!(title && categoryId && level && hasModules && hasPricing)

  return (
    <div className="space-y-6">
      <PublishChecklist
        title={title}
        categoryId={categoryId}
        level={level}
        hasModules={hasModules}
        hasPricing={hasPricing}
        hasThumbnail={hasThumbnail}
        onNavigate={useCourseFormStore.getState().setActiveTab}
      />
      <div className="grid grid-cols-2 gap-6">
        <PublishPreview />
        <div className="space-y-6">
          <PublishActions canPublish={canPublish} />
        </div>
      </div>
    </div>
  )
}
