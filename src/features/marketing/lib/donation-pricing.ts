export const ADMIN_FEE_RATE = 0.03

export function computeAdminFee(amount: number) {
  return Math.round(amount * ADMIN_FEE_RATE * 100) / 100
}

export function computeDonationTotal(amount: number) {
  return Math.round((amount + computeAdminFee(amount)) * 100) / 100
}