"use client"

import type { Module } from "@/features/courses/types"
import { PublishChecklist } from "./publish-checklist"
import { PublishPreview } from "./publish-preview"
import { PublishActions } from "./publish-actions"

interface Props {
  formValues: { title: string; categoryId: string; description?: string }
  categoryName: string
  modules: Module[]
  price: string
  discount: number
  isFree: boolean
  saleStart: Date | undefined
  saleEnd: Date | undefined
  level: string
  onLevelChange: (v: string) => void
  onNavigate: (tab: string) => void
  onSaveDraft: () => void
  onPublish: () => void
  onSchedule: (date: Date) => void
  thumbnailPreview: string | null
}

export function PublishSection({
  formValues,
  categoryName,
  modules,
  price,
  discount,
  isFree,
  saleStart,
  saleEnd,
  level,
  onLevelChange,
  onNavigate,
  onSaveDraft,
  onPublish,
  onSchedule,
  thumbnailPreview,
}: Props) {
  const { title, categoryId, description } = formValues
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
        onNavigate={onNavigate}
      />
      <div className="grid grid-cols-2 gap-6">
        <PublishPreview
          title={title}
          categoryName={categoryName}
          description={description ?? ""}
          level={level}
          modules={modules}
          price={price}
          discount={discount}
          isFree={isFree}
          thumbnailPreview={thumbnailPreview}
        />
        <div className="space-y-6">
          <PublishActions
            level={level}
            onLevelChange={onLevelChange}
            onSaveDraft={onSaveDraft}
            onPublish={onPublish}
            onSchedule={onSchedule}
            canPublish={canPublish}
          />
        </div>
      </div>
    </div>
  )
}
