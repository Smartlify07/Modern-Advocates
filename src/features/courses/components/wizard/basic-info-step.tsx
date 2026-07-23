"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { ThumbnailUpload } from "@/features/courses/components/wizard/thumbnail-upload"
import { Input } from "@/shared/ui/input"
import { Checkbox } from "@/shared/ui/checkbox"

export function BasicInfoStep() {
  const title = useCourseWizardStore((s) => s.title)
  const setTitle = useCourseWizardStore((s) => s.setTitle)
  const originalPrice = useCourseWizardStore((s) => s.originalPrice)
  const setOriginalPrice = useCourseWizardStore((s) => s.setOriginalPrice)
  const salePrice = useCourseWizardStore((s) => s.salePrice)
  const setSalePrice = useCourseWizardStore((s) => s.setSalePrice)
  const showStrikedOriginal = useCourseWizardStore((s) => s.showStrikedOriginal)
  const setShowStrikedOriginal = useCourseWizardStore(
    (s) => s.setShowStrikedOriginal
  )

  return (
    <div className="space-y-6">
      <ThumbnailUpload />

      <div className="border-t border-slate-200" />

      <div>
        <label className="mb-2 block text-sm font-normal text-primary">
          Course Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          maxLength={80}
          className="h-[44px] rounded-[8px]"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {title.length}/80
        </p>
      </div>

      <div className="border-t border-slate-200" />

      <div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-normal text-primary">
              Original Price (USD)*
            </label>
            <Input
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              className="h-[44px] [appearance:textfield] rounded-[8px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-normal text-primary">
              Sales Price (USD)*
            </label>
            <Input
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              className="h-[44px] [appearance:textfield] rounded-[8px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="show-striked"
          checked={showStrikedOriginal}
          onCheckedChange={(v) => setShowStrikedOriginal(v === true)}
          className="data-checked:bg-ma-admin-primary border-ma-admin-primary"
        />
        <label
          htmlFor="show-striked"
          className="cursor-pointer text-sm text-slate-600"
        >
          Show striked out original price
        </label>
      </div>
    </div>
  )
}
