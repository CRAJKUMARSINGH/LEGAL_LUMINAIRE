import { pgTable, serial, text, timestamp, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const casesTable = pgTable("cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caseNumber: text("case_number").notNull().default(""),
  category: text("category").notNull(),
  status: text("status").notNull().default("open"),
  clientPartyId: integer("client_party_id"),
  contractorPartyId: integer("contractor_party_id"),
  contractReference: text("contract_reference"),
  contractDate: date("contract_date"),
  scheduledStartDate: date("scheduled_start_date"),
  scheduledCompletionDate: date("scheduled_completion_date"),
  actualStartDate: date("actual_start_date"),
  description: text("description").notNull().default(""),
  legalGrounds: text("legal_grounds"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCaseSchema = createInsertSchema(casesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof casesTable.$inferSelect;
