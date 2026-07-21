"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Button } from "@/shared/ui/button"
import { UploadIcon, ImageIcon } from "lucide-react"

export function ThumbnailUpload() {
  const thumbnail = useCourseWizardStore((s) => s.thumbnail)
  const thumbnailPreview = useCourseWizardStore((s) => s.thumbnailPreview)
  const setThumbnail = useCourseWizardStore((s) => s.setThumbnail)

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
    <>
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
    </>
  )
}
