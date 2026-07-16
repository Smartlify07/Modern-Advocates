export interface Product {
  id: string
  name: string
  imageUrl: string | null
  salesPrice: number
  status: "live" | "archived"
  sales: number
}

export const sampleProducts: Product[] = [
  { id: "1", name: "Criminal Law Fundamentals", imageUrl: null, salesPrice: 49.99, status: "live", sales: 102 },
  { id: "2", name: "Constitutional Law Masterclass", imageUrl: null, salesPrice: 79.99, status: "live", sales: 110 },
  { id: "3", name: "Corporate Law Essentials", imageUrl: null, salesPrice: 59.99, status: "archived", sales: 50 },
  { id: "4", name: "Family Law Practice Guide", imageUrl: null, salesPrice: 39.99, status: "live", sales: 88 },
]

export const dateOptions = ["Last 7 Days", "Last 30 Days", "This Month", "This Year"]
