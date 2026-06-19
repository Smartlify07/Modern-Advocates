"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, SaveIcon, XIcon } from "lucide-react"

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" }),
  categoryId: z
    .string({ message: "Category is required" })
    .min(1, { message: "Category is required" }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Category = {
  id: string
  name: string
}

const steps = ["Basic Info", "Course Content", "Pricing", "Publish"]

export default function CreateCoursePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState("Basic Info")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
    },
  })

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
  }, [])

  const onSubmit = async (data: FormValues) => {
    console.log(data)
  }

  const handleSaveAndContinue = async () => {
    const valid = await form.trigger()
    if (!valid) return

    const data = form.getValues()
    await onSubmit(data)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {steps.map((step) => (
              <TabsTrigger key={step} value={step}>
                {step}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/courses">
              <XIcon className="size-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveAndContinue}>
            <SaveIcon className="size-4" />
            Save and Continue
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsContent value="Basic Info" className="flex flex-col gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <Card className="ring-0">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name="title"
                        render={({ fieldState, field }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Course Title
                            </FieldLabel>
                            <Input
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="e.g. Introduction to Criminal Law"
                            />
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="categoryId"
                        render={({ fieldState, field }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Category
                            </FieldLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className="w-full"
                              >
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="description"
                        render={({ fieldState, field }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Description
                            </FieldLabel>
                            <textarea
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="Describe what students will learn..."
                              className="h-32 w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
                            />
                            <FieldDescription>
                              A brief overview of the course content and
                              objectives.
                            </FieldDescription>

                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-6">
                <Card className="ring-0">
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <PlusIcon className="size-8" />
                        <span className="text-sm font-medium">
                          Upload Image
                        </span>
                        <span className="text-xs">16:9 ratio recommended</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="Course Content">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
            <p className="text-muted-foreground">
              Course Content — Coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="Pricing">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
            <p className="text-muted-foreground">Pricing — Coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="Publish">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
            <p className="text-muted-foreground">Publish — Coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
