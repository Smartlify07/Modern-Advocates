export interface Donation {
  id: string
  donorName: string
  donorEmail: string
  amount: number
  donationType: "fixed" | "tier" | "monthly"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: string
}

export const donationTypeLabels: Record<string, string> = {
  fixed: "Fixed donation",
  tier: "Tier Donation",
  monthly: "Monthly Donation",
}
