import { Router } from "express";
import { db, casesTable, noticesTable, correspondenceTable, billsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateCaseBody, UpdateCaseBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const { status, category } = req.query as Record<string, string | undefined>;
  let query = db.select().from(casesTable).$dynamic();
  if (status) {
    query = query.where(eq(casesTable.status, status));
  }
  const cases = await query.orderBy(casesTable.createdAt);
  if (category) {
    return res.json(cases.filter((c) => c.category === category));
  }
  res.json(cases);
});

router.post("/", async (req, res) => {
  const body = CreateCaseBody.parse(req.body);
  const [newCase] = await db
    .insert(casesTable)
    .values({ ...body, updatedAt: new Date() })
    .returning();
  res.status(201).json(newCase);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [c] = await db.select().from(casesTable).where(eq(casesTable.id, id));
  if (!c) return res.status(404).json({ error: "Case not found" });
  res.json(c);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateCaseBody.parse(req.body);
  const [updated] = await db
    .update(casesTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(casesTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Case not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(casesTable).where(eq(casesTable.id, id));
  res.status(204).send();
});

router.get("/:id/notices", async (req, res) => {
  const id = parseInt(req.params.id);
  const notices = await db
    .select()
    .from(noticesTable)
    .where(eq(noticesTable.caseId, id))
    .orderBy(noticesTable.issuedDate);
  res.json(notices);
});

router.get("/:id/correspondence", async (req, res) => {
  const id = parseInt(req.params.id);
  const items = await db
    .select()
    .from(correspondenceTable)
    .where(eq(correspondenceTable.caseId, id))
    .orderBy(correspondenceTable.correspondenceDate);
  res.json(items);
});

router.get("/:id/bills", async (req, res) => {
  const id = parseInt(req.params.id);
  const bills = await db
    .select()
    .from(billsTable)
    .where(eq(billsTable.caseId, id))
    .orderBy(billsTable.billDate);
  res.json(bills);
});

export default router;
