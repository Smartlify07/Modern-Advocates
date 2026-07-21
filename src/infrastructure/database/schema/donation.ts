import { pgEnum, pgTable, text, timestamp, numeric, uuid, index } from "drizzle-orm/pg-core"
import { paymentStatus } from "./course"

export const donationType = pgEnum("donation_type", ["fixed", "tier", "monthly"])

export const donations = pgTable(
  "donations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    donorName: text("donor_name").notNull(),
    donorEmail: text("donor_email").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
    currency: text("currency").notNull().default("USD"),
    donationType: donationType("donation_type").notNull(),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    createdAtIdx: index("donations_created_at_idx").on(table.createdAt),
  }),
)

export type InsertDonation = typeof donations.$inferInsert
export type SelectDonation = typeof donations.$inferSelect
