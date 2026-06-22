"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import type { Module } from "@/features/courses/types"
import { BasicInfoSection } from "@/features/courses/components/basic-info-section"
import { CourseContentSection } from "@/features/courses/components/course-content-section"
import { PricingSection } from "@/features/courses/components/pricing-section"
import { PublishSection } from "@/features/courses/components/publish-section"
import { SaveIcon, SendIcon, XIcon } from "lucide-react"

const formSchema = z.object({
  title: z.string({ message: "Title is required" }).min(1, { message: "Title is required" }),
  categoryId: z.string({ message: "Category is required" }).min(1, { message: "Category is required" }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Category = { id: string; name: string }

const steps = ["Basic Info", "Course Content", "Pricing", "Publish"]

export default function CreateCoursePage() {
  const [modules, setModules] = useState<Module[]>([])
  const [activeTab, setActiveTab] = useState("Basic Info")
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)

  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isFree, setIsFree] = useState(false)
  const [saleStart, setSaleStart] = useState<Date>()
  const [saleEnd, setSaleEnd] = useState<Date>()
  const [level, setLevel] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreview(null)
      return
    }
    const url = URL.createObjectURL(thumbnail)
    setThumbnailPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [thumbnail])

  const nextModuleId = useRef(1)
  const addModule = () => {
    const id = `module_${nextModuleId.current++}`
    setModules((prev) => [...prev, { id, title: "", topics: [], order: prev.length }])
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", categoryId: "", description: "" },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const onSubmit = async (data: FormValues) => {
    console.log(data)
  }

  const handleSaveAndContinue = async () => {
    const currentIndex = steps.indexOf(activeTab)
    if (activeTab === "Basic Info") {
      const valid = await form.trigger()
      if (!valid) return
    }
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1])
    } else {
      console.log("Publishing course...")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {steps.map((step) => (
              <TabsTrigger key={step} value={step}>{step}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/courses"><XIcon className="size-4" />Cancel</Link>
          </Button>
          <Button onClick={handleSaveAndContinue}>
            {activeTab === "Publish" ? <SendIcon className="size-4" /> : <SaveIcon className="size-4" />}
            {activeTab === "Publish" ? "Publish" : "Save and Continue"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsContent value="Basic Info" className="flex flex-col gap-4">
          <BasicInfoSection form={form} categories={categories} onSubmit={onSubmit} thumbnail={thumbnail} onThumbnailChange={setThumbnail} />
        </TabsContent>

        <TabsContent value="Course Content" className="flex flex-col gap-4">
          <CourseContentSection
            modules={modules}
            activeModuleId={activeModuleId}
            activeTopicId={activeTopicId}
            onAddModule={addModule}
            onModuleChange={(id, updated) => setModules((prev) => prev.map((m) => (m.id === id ? updated : m)))}
            onModuleSelect={(id) => { setActiveModuleId(id); setActiveTopicId(null) }}
            onBack={() => { setActiveModuleId(null); setActiveTopicId(null) }}
            onActiveTopicChange={setActiveTopicId}
          />
        </TabsContent>

        <TabsContent value="Pricing">
          <PricingSection
            price={price}
            onPriceChange={setPrice}
            discount={discount}
            onDiscountChange={setDiscount}
            isFree={isFree}
            onFreeChange={setIsFree}
            saleStart={saleStart}
            onSaleStartChange={setSaleStart}
            saleEnd={saleEnd}
            onSaleEndChange={setSaleEnd}
          />
        </TabsContent>

        <TabsContent value="Publish">
          <PublishSection
            formValues={form.watch()}
            categoryName={categories?.find((c) => c.id === form.watch("categoryId"))?.name ?? ""}
            modules={modules}
            price={price}
            discount={discount}
            isFree={isFree}
            saleStart={saleStart}
            saleEnd={saleEnd}
            level={level}
            onLevelChange={setLevel}
            onNavigate={setActiveTab}
            onSaveDraft={() => console.log("Save draft")}
            onPublish={() => console.log("Publish")}
            onSchedule={(date) => console.log("Schedule for", date)}
            thumbnailPreview={thumbnailPreview}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
