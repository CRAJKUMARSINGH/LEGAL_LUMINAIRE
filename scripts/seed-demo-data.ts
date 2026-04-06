/**
 * Seed Demo Data — Legal Luminaire
 * Loads Case 01 documents into ChromaDB for offline demo use.
 * Run: pnpm --filter @workspace/scripts run seed-demo
 *
 * ASSUMPTION: Backend must be running on localhost:8000
 * ASSUMPTION: OPENAI_API_KEY must be set in environment
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

interface SeedResult {
  case: string;
  status: "ok" | "error";
  message: string;
}

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function seedCase(caseId: string, documents: string[]): Promise<SeedResult> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_id: caseId, documents }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { case: caseId, status: "error", message: err };
    }
    return { case: caseId, status: "ok", message: "Seeded successfully" };
  } catch (e) {
    return { case: caseId, status: "error", message: String(e) };
  }
}

async function main() {
  console.log("Legal Luminaire — Demo Data Seeder");
  console.log("====================================");

  const healthy = await checkHealth();
  if (!healthy) {
    console.error(`Backend not reachable at ${BACKEND_URL}. Start it first.`);
    process.exit(1);
  }
  console.log("✅ Backend healthy");

  // Case 01 — Building Collapse (primary demo case)
  const case01Result = await seedCase("case01", [
    "CASE01_HEMRAJ_STATE_2025/FIR_456_2025.md",
    "CASE01_HEMRAJ_STATE_2025/Charge_Sheet.md",
    "CASE01_HEMRAJ_STATE_2025/FSL_Report.md",
  ]);
  console.log(`Case 01: ${case01Result.status} — ${case01Result.message}`);

  console.log("\nSeed complete. Start the frontend with: pnpm dev");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
