import { pgEnum, pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core"

export const ticketStatus = pgEnum("ticket_status", ["open", "pending", "resolved"])

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    status: ticketStatus("status").notNull().default("open"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    statusIdx: index("contacts_status_idx").on(table.status),
    createdAtIdx: index("contacts_created_at_idx").on(table.createdAt),
  }),
)

export type InsertContact = typeof contacts.$inferInsert
export type SelectContact = typeof contacts.$inferSelect
