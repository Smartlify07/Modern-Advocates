export const DURATION_UNITS = ["Minutes", "Hours", "Days", "Weeks"] as const
export type DurationUnit = (typeof DURATION_UNITS)[number]

const UNIT_TO_MINUTES: Record<DurationUnit, number> = {
  Minutes: 1,
  Hours: 60,
  Days: 1440,
  Weeks: 10080,
}

export function durationToMinutes(value: number, unit: DurationUnit): number {
  return value * UNIT_TO_MINUTES[unit]
}

export function minutesToDuration(
  minutes: number,
  unit: DurationUnit
): { value: number; unit: DurationUnit } {
  const divisor = UNIT_TO_MINUTES[unit]
  return { value: minutes / divisor, unit }
}