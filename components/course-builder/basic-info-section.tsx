"use client"

import { Controller, type UseFormReturn } from "react-hook-form"
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
import { PlusIcon } from "lucide-react"

type FormValues = {
  title: string
  categoryId: string
  description?: string
}

type Category = { id: string; name: string }

interface Props {
  form: UseFormReturn<FormValues>
  categories: Category[] | undefined
  onSubmit: (data: FormValues) => void
}

function ThumbnailUpload() {
  return (
    <Card className="ring-0">
      <CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader>
      <CardContent>
        <div className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <PlusIcon className="size-8" />
            <span className="text-sm font-medium">Upload Image</span>
            <span className="text-xs">16:9 ratio recommended</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DescriptionField({ control }: { control: Props["form"]["control"] }) {
  return (
    <Controller
      control={control}
      name="description"
      render={({ fieldState, field }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Description</FieldLabel>
          <textarea
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder="Describe what students will learn..."
            className="h-32 w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
          />
          <FieldDescription>
            A brief overview of the course content and objectives.
          </FieldDescription>
          {fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  )
}

export function BasicInfoSection({ form, categories, onSubmit }: Props) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card className="ring-0">
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="title"
                  render={({ fieldState, field }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Course Title</FieldLabel>
                      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="e.g. Introduction to Criminal Law" />
                      {fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ fieldState, field }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(categories ?? []).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
                    </Field>
                  )}
                />
                <DescriptionField control={form.control} />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <ThumbnailUpload />
        </div>
      </div>
    </form>
  )
}
