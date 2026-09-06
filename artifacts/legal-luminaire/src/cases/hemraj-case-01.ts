/**
 * CASE_01 — Hemraj Vardar (Stadium Wall Collapse) as a data-layer record.
 *
 * Source of truth for the content remains `data/caseData.ts` + `lib/case01-data.ts`
 * (those files are shared with the drafting pages). This module only *adapts* them into
 * the `CaseRecord` shape so that every case-scoped view reads from the selected case
 * instead of importing Hemraj data directly.
 *
 * Loaded through Demo Mode → labelled SYNTHETIC / DEMO (`isDemo: true`).
 */
import type { CaseRecord } from "@/lib/case-store";
import { DEFAULT_CASE_ID } from "@/lib/case-store";
import {
  caseInfo, timelineEvents, caseLawMatrix, standardsMatrix, caseDocuments,
} from "@/data/caseData";
import { CASE01_META } from "@/lib/case01-data";
import { commonSection } from "@/data/defenceData";

export const HEMRAJ_DEMO_ID = "TC-01";

const STRATEGY_PILLARS: Array<{ title: string; description: string }> = [
  { title: "Chain-of-custody gaps in forensic sampling", description: "No custody register from collection → sealing → dispatch → lab receipt (Kattavellai 2025 INSC 845 guidelines)." },
  { title: "Weather contamination during sample collection", description: "Rain-time sampling; ASTM C780 §6.1 invalidates moisture-exposed samples." },
  { title: "Absence of contractor representation", description: "Ex-parte sampling — IS 3535:1986 Cl. 4.1 and CPWD Manual require contractor presence." },
  { title: "Non-representative / haphazard sampling method", description: "No documented sampling protocol or panchnama." },
  { title: "FSL report foundation challenge", description: "IS 1199:2018 (fresh concrete) applied to hardened masonry mortar — wrong standard." },
  { title: "BIS/IS procedural non-compliance", description: "IS 2250 / ASTM C1324 carbonated-layer removal ignored." },
];

function kbToBytes(size: string): number {
  const n = parseFloat(size);
  return Number.isFinite(n) ? Math.round(n * 1024) : 0;
}

function applicabilityOf(proposition: string): "correct" | "wrong" | "partial" {
  const p = proposition.toUpperCase();
  if (p.startsWith("WRONG")) return "wrong";
  if (p.startsWith("CORRECT")) return "correct";
  return "partial";
}

function splitPrayer(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => /^\d+\./.test(l));
}

export function buildHemrajCaseRecord(id: string = DEFAULT_CASE_ID): CaseRecord {
  const now = new Date().toISOString();
  return {
    id,
    title: `[DEMO] ${caseInfo.title} — Hemraj Vardar`,
    court: CASE01_META.court,
    caseNo: CASE01_META.caseNo,
    brief: caseInfo.summary,
    createdAt: now,
    files: [],
    isDemo: true,
    sourceDemoId: HEMRAJ_DEMO_ID,
    case_type: "discharge",
    status: caseInfo.status,
    filing_date: "2025-01-01",
    charges: ["IPC §304A", "IPC §337", "IPC §338", "PC Act §13(1)(d)", "IPC §120B"],
    parties: [
      { name: CASE01_META.accused, role: "accused", lawyer: "Defence Counsel", address: CASE01_META.accusedDesignation },
      { name: "State of Rajasthan", role: "complainant" },
    ],
    accused_names: [CASE01_META.accused],
    citations: caseLawMatrix.map((c, i) => ({
      id: `cit-${i + 1}`,
      caseName: c.case,
      citation: c.case,
      court: c.court,
      holding: c.useForDefence,
      status: c.status,
      blockedFromDraft: c.status === "PENDING",
    })),
    caseLaw: caseLawMatrix.map((c) => ({ ...c })),
    timeline: timelineEvents.map((e) => ({ ...e })),
    standards: standardsMatrix.map((s) => ({
      code: s.standard,
      title: s.standard,
      applicability: applicabilityOf(s.proposition),
      keyClause: s.proposition,
      violation: s.caseFact,
      confidence: s.confidence,
    })),
    documents: caseDocuments.map((d, i) => ({
      id: `doc-${i + 1}`,
      name: d.name,
      type: d.type,
      status: "VERIFIED",
      size: kbToBytes(d.size),
      uploadedAt: now,
    })),
    strategy: STRATEGY_PILLARS.map((p, i) => ({
      id: `s${i + 1}`,
      title: p.title,
      description: p.description,
      status: "ACTIVE",
      priority: i < 3 ? "HIGH" : "MEDIUM",
    })),
    prayerClauses: splitPrayer(commonSection.prayerEn),
    verificationBlocks: CASE01_META.primaryGrounds.map((g, i) => ({
      id: `vb-${i + 1}`,
      claim: g,
      status: i < 5 ? "VERIFIED" : "SECONDARY",
      evidence: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md / WRITTEN_SUBMISSION_RHC_FINAL_v3.lex",
      blockedFromDraft: false,
    })),
    metadata: {
      category: "Criminal — Forensic Defence",
      complexity: "ADVANCED",
      estimatedDuration: "6-12 months",
      requiredResources: ["IS 2250:1981", "ASTM C1324", "ASTM C780", "ISO/IEC 17025 (NABL)"],
    },
  };
}
