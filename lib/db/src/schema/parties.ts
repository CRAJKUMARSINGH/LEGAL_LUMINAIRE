import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const partiesTable = pgTable("parties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  partyType: text("party_type").notNull(),
  address: text("address"),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  gstin: text("gstin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPartySchema = createInsertSchema(partiesTable).omit({ id: true, createdAt: true });
export type InsertParty = z.infer<typeof insertPartySchema>;
export type Party = typeof partiesTable.$inferSelect;
