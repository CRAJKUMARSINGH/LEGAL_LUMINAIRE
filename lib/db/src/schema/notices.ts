import { pgTable, serial, text, timestamp, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const noticesTable = pgTable("notices", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  noticeNumber: text("notice_number"),
  noticeType: text("notice_type").notNull(),
  title: text("title").notNull(),
  issuedBy: text("issued_by").notNull(),
  issuedTo: text("issued_to").notNull(),
  issuedDate: date("issued_date").notNull(),
  responseDeadline: date("response_deadline"),
  clauseReferences: text("clause_references"),
  content: text("content").notNull(),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNoticeSchema = createInsertSchema(noticesTable).omit({ id: true, createdAt: true });
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Notice = typeof noticesTable.$inferSelect;
