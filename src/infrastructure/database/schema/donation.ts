import { pgEnum, pgTable, text, timestamp, numeric, index } from "drizzle-orm/pg-core"

export const donationType = pgEnum("donation_type", ["fixed", "tier", "monthly"])

export const donations = pgTable(
  "donations",
  {
    id: text("id").primaryKey(),
    donorName: text("donor_name").notNull(),
    donorEmail: text("donor_email").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
    donationType: donationType("donation_type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("donations_created_at_idx").on(table.createdAt),
  }),
)

export type InsertDonation = typeof donations.$inferInsert
export type SelectDonation = typeof donations.$inferSelect
