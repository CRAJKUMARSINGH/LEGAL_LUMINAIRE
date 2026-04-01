import { db, legalSessionsTable, legalDocumentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const CASE_DOCS: Array<{ filename: string; originalName: string; mimeType: string; url: string }> = [
  { filename: "Comprehensive_Legal_Defence_Report.md", originalName: "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Comprehensive_Legal_Defence_Report_Stadium_Collapse.md" },
  { filename: "Case_Facts_Timeline.md", originalName: "Case_Facts_Timeline.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Case_Facts_Timeline.md" },
  { filename: "Case_Law_Matrix_Verified_Pending.md", originalName: "Case_Law_Matrix_Verified_Pending.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Case_Law_Matrix_Verified_Pending.md" },
  { filename: "Argument_Bank_And_Annexure_Builder.md", originalName: "Argument_Bank_And_Annexure_Builder.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Argument_Bank_And_Annexure_Builder.md" },
  { filename: "DEEPsEARCH.md", originalName: "DEEPsEARCH.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/DEEPsEARCH.md" },
  { filename: "Forensic_Protocol_Checklist.md", originalName: "Forensic_Protocol_Checklist.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Forensic_Protocol_Checklist.md" },
  { filename: "Cross_Reference_Matrix_Detailed.lex", originalName: "Cross_Reference_Matrix_Detailed.lex", mimeType: "text/plain", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Cross_Reference_Matrix_Detailed.lex" },
  { filename: "Legal_Case_References_Brief_Notes.md", originalName: "Legal_Case_References_Brief_Notes.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Legal_Case_References_Brief_Notes.md" },
  { filename: "Standards_Matrix_IS_ASTM_NABL.md", originalName: "Standards_Matrix_IS_ASTM_NABL.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Standards_Matrix_IS_ASTM_NABL.md" },
  { filename: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md", originalName: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md", mimeType: "text/markdown", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md" },
  { filename: "SUPERIOR_HINDI_DISCHARGE_APPLICATION.lex", originalName: "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex", mimeType: "text/plain", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex" },
  { filename: "Stadium_Collapse_Defence_Hindi.lex", originalName: "Stadium_Collapse_Defence_Hindi.lex", mimeType: "text/plain", url: "https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/CASE_01_HemrajG/Stadium_Collapse_Defence_Hindi.lex" },
];

async function main() {
  console.log("Checking if Hemraj case session already exists...");

  const existing = await db.select().from(legalSessionsTable).where(eq(legalSessionsTable.caseNumber, "1/2025-Udaipur"));
  
  if (existing.length > 0) {
    console.log("Session already exists — deleting existing documents and re-seeding...");
    await db.delete(legalDocumentsTable).where(eq(legalDocumentsTable.sessionId, existing[0].id));
    await db.delete(legalSessionsTable).where(eq(legalSessionsTable.id, existing[0].id));
  }

  console.log("Creating Hemraj Vardar case session...");
  const [session] = await db.insert(legalSessionsTable).values({
    title: "Hemraj Vardar — Stadium Wall Collapse Defence",
    caseNumber: "1/2025-Udaipur",
    court: "Special Session Court, Udaipur (Rajasthan)",
    accusedName: "Hemraj Vardar (Contractor / Director)",
    sections: "IPC 304A, 337, 338 + Prevention of Corruption Act | BNSS Section 250 (Discharge)",
    description: "Stadium outer wall partially collapsed post-construction/repair. Forensic samples collected during stormy rain without contractor representative, violating IS 1199:2018. Defence strategy: chain-of-custody failure, surface contamination, sampling protocol violations, absence of representative, Kattavellai precedent.",
  }).returning();

  console.log(`Session created: id=${session.id}`);

  let seeded = 0;
  for (const doc of CASE_DOCS) {
    try {
      console.log(`Fetching ${doc.originalName}...`);
      const resp = await fetch(doc.url);
      if (!resp.ok) {
        console.warn(`  SKIP: HTTP ${resp.status}`);
        continue;
      }
      const contentText = await resp.text();
      if (!contentText.trim()) {
        console.warn(`  SKIP: empty content`);
        continue;
      }

      await db.insert(legalDocumentsTable).values({
        sessionId: session.id,
        filename: doc.filename,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        contentText,
        fileSize: Buffer.byteLength(contentText, "utf-8"),
      });

      console.log(`  Seeded: ${doc.originalName} (${contentText.length} chars)`);
      seeded++;
    } catch (err) {
      console.error(`  ERROR seeding ${doc.originalName}:`, err);
    }
  }

  console.log(`\nDone. Created session id=${session.id} with ${seeded}/${CASE_DOCS.length} documents.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
