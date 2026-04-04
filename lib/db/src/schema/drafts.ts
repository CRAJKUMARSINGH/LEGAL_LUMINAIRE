import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const draftsTable = pgTable("drafts", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  noticeId: integer("notice_id"),
  title: text("title").notNull(),
  draftType: text("draft_type").notNull(),
  status: text("status").notNull().default("draft"),
  subject: text("subject").notNull(),
  toParty: text("to_party").notNull(),
  fromParty: text("from_party").notNull(),
  content: text("content").notNull(),
  legalBasis: text("legal_basis"),
  enclosures: text("enclosures"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDraftSchema = createInsertSchema(draftsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDraft = z.infer<typeof insertDraftSchema>;
export type Draft = typeof draftsTable.$inferSelect;
