"use client"

import { cn } from "@/shared/utils"
import type { LucideIcon } from "lucide-react"

export interface Step {
  title: string
  icon: LucideIcon
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
  onStepClick?: (index: number) => void
}

export function Stepper({ steps, currentStep, completedSteps, onStepClick }: StepperProps) {
  const canClickStep = (index: number) => index === 0 || (completedSteps ?? []).includes(index - 1)

  return (
    <div className="flex w-full items-center justify-between border-b border-slate-200">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index)
        const isActive = currentStep === index
        const isUpcoming = !isCompleted && !isActive
        const clickable = canClickStep(index)

        return (
          <div key={step.title} className="flex items-center">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(index)}
              className={cn(
                "flex items-center gap-2 py-3 relative transition-colors",
                isActive && "border-b-2 border-ma-admin-primary -mb-px",
                clickable && "cursor-pointer",
                !clickable && "cursor-default",
              )}
            >
              <step.icon className={cn(
                "size-4 shrink-0 transition-colors",
                isActive && "text-ma-admin-primary",
                isCompleted && "text-slate-400 group-hover:text-primary",
                isUpcoming && "text-slate-400",
              )} />
              <span className={cn(
                "text-sm whitespace-nowrap transition-colors",
                isActive && "font-semibold text-primary",
                isCompleted && "text-slate-400 hover:text-primary",
                isUpcoming && "text-slate-400",
              )}>
                {step.title}
              </span>
              {isCompleted && (
                <span className="text-green-500 text-xs font-bold leading-none">✓✓</span>
              )}
              {isActive && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {index + 1}/{steps.length}
                </span>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
