import { pgTable, serial, text, timestamp, date, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const billsTable = pgTable("bills", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  billNumber: text("bill_number").notNull(),
  billType: text("bill_type").notNull(),
  description: text("description").notNull(),
  amountRs: numeric("amount_rs", { precision: 15, scale: 2 }).notNull(),
  gstPercent: numeric("gst_percent", { precision: 5, scale: 2 }),
  totalAmountRs: numeric("total_amount_rs", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  billDate: date("bill_date").notNull(),
  dueDate: date("due_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBillSchema = createInsertSchema(billsTable).omit({ id: true, createdAt: true });
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof billsTable.$inferSelect;
