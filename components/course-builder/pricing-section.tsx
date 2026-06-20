"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface Props {
  price: string
  onPriceChange: (v: string) => void
  discount: number
  onDiscountChange: (v: number) => void
  isFree: boolean
  onFreeChange: (v: boolean) => void
  saleStart: Date | undefined
  onSaleStartChange: (v: Date | undefined) => void
  saleEnd: Date | undefined
  onSaleEndChange: (v: Date | undefined) => void
}

function SalePeriodPicker({
  saleStart,
  saleEnd,
  onSaleStartChange,
  onSaleEndChange,
}: {
  saleStart: Date | undefined
  saleEnd: Date | undefined
  onSaleStartChange: (v: Date | undefined) => void
  onSaleEndChange: (v: Date | undefined) => void
}) {
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
            <Calendar mode="single" selected={saleStart} onSelect={onSaleStartChange} />
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
            <Calendar mode="single" selected={saleEnd} onSelect={onSaleEndChange} />
          </PopoverContent>
        </Popover>
      </div>
    </Field>
  )
}

function SalePreviewCard({
  isFree,
  numericPrice,
  discount,
  salePrice,
  saleEnd,
}: {
  isFree: boolean
  numericPrice: number
  discount: number
  salePrice: number
  saleEnd: Date | undefined
}) {
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

export function PricingSection({
  price,
  onPriceChange,
  discount,
  onDiscountChange,
  isFree,
  onFreeChange,
  saleStart,
  onSaleStartChange,
  saleEnd,
  onSaleEndChange,
}: Props) {
  const numericPrice = isFree ? 0 : parseFloat(price) || 0
  const salePrice = numericPrice * (1 - discount / 100)

  return (
    <div className="max-w-lg space-y-6">
      <Card className="ring-0">
        <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="free-switch">Free course</FieldLabel>
              <Switch id="free-switch" checked={isFree} onCheckedChange={onFreeChange} />
            </div>
          </Field>

          <Field data-disabled={isFree}>
            <FieldLabel htmlFor="price">Course price</FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">$</span>
              <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" value={price} onChange={(e) => onPriceChange(e.target.value)} disabled={isFree} className="pl-7" />
            </div>
          </Field>

          {!isFree && discount > 0 && (
            <SalePeriodPicker
              saleStart={saleStart}
              saleEnd={saleEnd}
              onSaleStartChange={onSaleStartChange}
              onSaleEndChange={onSaleEndChange}
            />
          )}

          {!isFree && (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="discount">Discount</FieldLabel>
                <span className="text-sm font-medium tabular-nums text-muted-foreground">{discount}%</span>
              </div>
              <Slider id="discount" value={[discount]} onValueChange={([v]) => onDiscountChange(v)} max={100} step={1} className="py-2" />
            </Field>
          )}

          <SalePreviewCard
            isFree={isFree}
            numericPrice={numericPrice}
            discount={discount}
            salePrice={salePrice}
            saleEnd={saleEnd}
          />
        </CardContent>
      </Card>
    </div>
  )
}
