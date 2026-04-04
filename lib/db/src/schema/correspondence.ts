import { pgTable, serial, text, timestamp, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const correspondenceTable = pgTable("correspondence", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  referenceNumber: text("reference_number"),
  direction: text("direction").notNull(),
  subject: text("subject").notNull(),
  fromParty: text("from_party").notNull(),
  toParty: text("to_party").notNull(),
  correspondenceDate: date("correspondence_date").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCorrespondenceSchema = createInsertSchema(correspondenceTable).omit({ id: true, createdAt: true });
export type InsertCorrespondence = z.infer<typeof insertCorrespondenceSchema>;
export type Correspondence = typeof correspondenceTable.$inferSelect;
