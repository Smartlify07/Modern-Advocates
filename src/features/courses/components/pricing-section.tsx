"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Field, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Slider } from "@/shared/ui/slider"
import { Switch } from "@/shared/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { Calendar } from "@/shared/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"

function SalePeriodPicker() {
  const saleStart = useCourseFormStore((s) => s.saleStart)
  const saleEnd = useCourseFormStore((s) => s.saleEnd)
  const setSaleStart = useCourseFormStore((s) => s.setSaleStart)
  const setSaleEnd = useCourseFormStore((s) => s.setSaleEnd)

  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel>Sale period</FieldLabel>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" data-empty={!saleStart} className="flex-1 justify-start text-left font-normal data-[empty=true]:text-muted-foreground">
              <CalendarIcon className="size-4" />
              {saleStart ? format(saleStart, "MMM d, yyyy") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={saleStart} onSelect={setSaleStart} />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground">to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" data-empty={!saleEnd} className="flex-1 justify-start text-left font-normal data-[empty=true]:text-muted-foreground">
              <CalendarIcon className="size-4" />
              {saleEnd ? format(saleEnd, "MMM d, yyyy") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={saleEnd} onSelect={setSaleEnd} />
          </PopoverContent>
        </Popover>
      </div>
    </Field>
  )
}

function SalePreviewCard() {
  const isFree = useCourseFormStore((s) => s.isFree)
  const price = useCourseFormStore((s) => s.price)
  const discount = useCourseFormStore((s) => s.discount)
  const saleEnd = useCourseFormStore((s) => s.saleEnd)

  const numericPrice = isFree ? 0 : parseFloat(price) || 0
  const salePrice = numericPrice * (1 - discount / 100)

  if (isFree) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">Status</p>
        <p className="mt-0.5 text-2xl font-bold text-green-600">Free</p>
      </div>
    )
  }
  if (numericPrice <= 0) return null
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">Price after sale</p>
      <p className="mt-0.5 text-2xl font-bold">${salePrice.toFixed(2)}</p>
      {discount > 0 && (
        <p className="mt-0.5 text-xs text-muted-foreground line-through">
          ${numericPrice.toFixed(2)}
        </p>
      )}
      {saleEnd && (
        <p className="mt-1 text-xs text-muted-foreground">
          Sale ends {format(saleEnd, "MMM d, yyyy")}
        </p>
      )}
    </div>
  )
}

export function PricingSection() {
  const price = useCourseFormStore((s) => s.price)
  const setPrice = useCourseFormStore((s) => s.setPrice)
  const discount = useCourseFormStore((s) => s.discount)
  const setDiscount = useCourseFormStore((s) => s.setDiscount)
  const isFree = useCourseFormStore((s) => s.isFree)
  const setIsFree = useCourseFormStore((s) => s.setIsFree)

  return (
    <div className="max-w-lg space-y-6">
      <Card className="ring-0">
        <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="free-switch">Free course</FieldLabel>
              <Switch id="free-switch" checked={isFree} onCheckedChange={setIsFree} />
            </div>
          </Field>

          <Field data-disabled={isFree}>
            <FieldLabel htmlFor="price">Course price</FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">$</span>
              <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} disabled={isFree} className="pl-7" />
            </div>
          </Field>

          {!isFree && discount > 0 && <SalePeriodPicker />}

          {!isFree && (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="discount">Discount</FieldLabel>
                <span className="text-sm font-medium tabular-nums text-muted-foreground">{discount}%</span>
              </div>
              <Slider id="discount" value={[discount]} onValueChange={([v]) => setDiscount(v)} max={100} step={1} className="py-2" />
            </Field>
          )}

          <SalePreviewCard />
        </CardContent>
      </Card>
    </div>
  )
}
