"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Checkbox } from "@/shared/ui/checkbox"
import { UploadIcon, ImageIcon } from "lucide-react"

export function BasicInfoStep() {
  const title = useCourseWizardStore((s) => s.title)
  const setTitle = useCourseWizardStore((s) => s.setTitle)
  const thumbnail = useCourseWizardStore((s) => s.thumbnail)
  const thumbnailPreview = useCourseWizardStore((s) => s.thumbnailPreview)
  const setThumbnail = useCourseWizardStore((s) => s.setThumbnail)
  const originalPrice = useCourseWizardStore((s) => s.originalPrice)
  const setOriginalPrice = useCourseWizardStore((s) => s.setOriginalPrice)
  const salePrice = useCourseWizardStore((s) => s.salePrice)
  const setSalePrice = useCourseWizardStore((s) => s.setSalePrice)
  const showStrikedOriginal = useCourseWizardStore((s) => s.showStrikedOriginal)
  const setShowStrikedOriginal = useCourseWizardStore(
    (s) => s.setShowStrikedOriginal
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail)
      setLocalPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    if (thumbnailPreview && thumbnailPreview.startsWith("http")) {
      setLocalPreview(thumbnailPreview)
    } else {
      setLocalPreview(null)
    }
  }, [thumbnail, thumbnailPreview])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setThumbnail(f)
  }

  return (
    <div className="space-y-6">
      <label className="mb-2 block text-sm font-normal text-primary">
        Course Thumbnail
      </label>
      <div className="flex items-start gap-6">
        {localPreview ? (
          <div className="relative flex size-[228px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <Image
              src={localPreview}
              alt="Thumbnail"
              fill
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex size-[228px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <ImageIcon className="size-[124px] text-slate-300" />
          </div>
        )}
        <div className="flex flex-col gap-6 pt-1">
          <p className="max-w-[528px] text-sm leading-relaxed text-slate-500">
            Upload your course Thumbnail here.{" "}
            <span className="font-normal text-primary">
              Important guidelines:
            </span>{" "}
            1200x800 pixels or 12:8 Ratio.{" "}
            <span className="font-normal text-primary">Supported format:</span>{" "}
            <span className="font-normal text-primary">
              .jpg, .jpeg, or .png
            </span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-[44px] w-fit flex-row-reverse rounded-[8px] bg-slate-100 text-primary hover:bg-slate-200"
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon className="mr-1 size-4" />
            Upload Image
          </Button>
        </div>
      </div>

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
