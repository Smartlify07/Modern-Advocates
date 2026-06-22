"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { PlusIcon, XIcon, UploadIcon } from "lucide-react"

interface Props {
  file: File | null
  onChange: (file: File | null) => void
}

export function ThumbnailUpload({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(null)
  }, [file])

  const handleSelect = () => inputRef.current?.click()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onChange(f)
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <Card className="ring-0">
      <CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader>
      <CardContent>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {preview ? (
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted/30">
            <img src={preview} alt="Thumbnail preview" className="size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <Button variant="secondary" size="sm" onClick={handleSelect} type="button">
                <UploadIcon className="size-3.5" />Change
              </Button>
              <Button variant="destructive" size="sm" onClick={handleRemove} type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/80">
                <XIcon className="size-3.5" />Remove
              </Button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={handleSelect} className="flex aspect-video w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <PlusIcon className="size-8" />
              <span className="text-sm font-medium">Upload Image</span>
              <span className="text-xs">16:9 ratio recommended</span>
            </div>
          </button>
        )}
      </CardContent>
    </Card>
  )
}
