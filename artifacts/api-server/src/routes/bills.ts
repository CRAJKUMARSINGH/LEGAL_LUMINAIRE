import { Router } from "express";
import { db, billsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBillBody, UpdateBillBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const { caseId, status } = req.query as Record<string, string | undefined>;
  let bills = await db.select().from(billsTable).orderBy(billsTable.billDate);
  if (caseId) {
    bills = bills.filter((b) => b.caseId === parseInt(caseId));
  }
  if (status) {
    bills = bills.filter((b) => b.status === status);
  }
  res.json(bills);
});

router.post("/", async (req, res) => {
  const body = CreateBillBody.parse(req.body);
  const [bill] = await db.insert(billsTable).values(body).returning();
  res.status(201).json(bill);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [bill] = await db.select().from(billsTable).where(eq(billsTable.id, id));
  if (!bill) return res.status(404).json({ error: "Bill not found" });
  res.json(bill);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateBillBody.parse(req.body);
  const [updated] = await db
    .update(billsTable)
    .set(body)
    .where(eq(billsTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Bill not found" });
  res.json(updated);
});

export default router;
