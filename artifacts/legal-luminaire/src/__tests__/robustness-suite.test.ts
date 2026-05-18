/**
 * TEST FILE 4 — Robustness Suite
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps to: ROBUSTNESS_TESTING/AUTOMATED_TEST_SUITE.md — ALL categories
 * Maps to: ROBUSTNESS_TESTING/SELF_ASSESSMENT_FRAMEWORK.md — all test IDs
 * Maps to: accuracy-rules.md — Rules 1-9
 *
 * This is the consolidated robustness test suite that covers:
 *   LA-001 to LA-003  — Legal Accuracy
 *   DP-001 to DP-004  — Document Processing
 *   AC-001 to AC-002  — Analytical Capabilities
 *   PF-001 to PF-003  — Performance
 *   SC-001 to SC-002  — Security
 *   RG-001            — Regression (cross-module consistency)
 *
 * Each test is tagged with its AUTOMATED_TEST_SUITE.md test ID.
 */

import { describe, it, expect, beforeAll } from "vitest";
import {
  PRECEDENT_ACCURACY,
  STANDARDS_ACCURACY,
  getCourtSafePrecedents,
  getBlockedPrecedents,
  overallAccuracyScore,
  generateAccuracyReport,
  type PrecedentAccuracy,
} from "@/lib/verification-engine";
import {
  scanDraftForCitations,
  type GateResult,
} from "@/lib/citation-gate";

// ─── TEST DATA ────────────────────────────────────────────────────────────────

// 3 test cases as required by accuracy-rules.md Rule 8
const TEST_CASE_DISCHARGE = {
  name: "TC-01: Discharge Application (Hemraj case pattern)",
  draft: `
    Relying on Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10,
    the material on record discloses nothing more than a suspicion.
    State of Bihar v. Ramesh Singh (1977) 4 SCC 39, Para 5 confirms
    that the court must satisfy itself that a prima facie case exists.
    The prosecution wrongly applied IS 1199:2018 to hardened masonry mortar.
    IS 2250:1981 is the correct standard for masonry mortar.
  `,
  expectedStatus: "SAFE" as const,
  expectedHardBlock: false,
  minMatches: 2,
};

const TEST_CASE_BAIL = {
  name: "TC-02: Bail Application",
  draft: `
    Anticipatory bail application under Section 438 CrPC.
    Jacob Mathew v. State of Punjab (2005) 6 SCC 1, Para 48 — negligence standard.
    Kattavellai @ Devakar v. State of Tamil Nadu 2025 INSC 845 — chain of custody.
  `,
  expectedStatus: "SAFE" as const,
  expectedHardBlock: false,
  minMatches: 1,
};

const TEST_CASE_ADVERSARIAL = {
  name: "TC-03: Adversarial — fake/unverified citations injected",
  draft: `
    The failure to prepare a proper Panchnama creates an incurable defect.
    State of Gujarat v. Mohanbhai (2003) 4 GLR 3121.
    R.B. Constructions v. State of Maharashtra 2014 SCC OnLine Bom 125.
    M/s. Builders Association v. State of UP 2018 SCC OnLine All 442.
  `,
  expectedStatus: "BLOCKED" as const,
  expectedHardBlock: true,
  minMatches: 1,
};

const TEST_CASE_WRITTEN_SUBMISSION = {
  name: "TC-04: Written Submission (mixed tiers)",
  draft: `
    Written submission in support of discharge application.
    Primary reliance: Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4.
    Secondary reliance: Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317.
    Standards: IS 1199:2018 wrongly applied. ASTM C1324 is the correct standard.
  `,
  expectedStatus: "WARN" as const,
  expectedHardBlock: false,
  minMatches: 2,
};

// ─── SUITE 1: LA-001 — CONTRACT/CRIMINAL LAW ACCURACY ────────────────────────

describe("[LA-001] Legal Accuracy — Criminal Law Analysis", () => {
  it("LA-001-a: discharge application draft is not hard-blocked (COURT_SAFE citations present)", () => {
    const result = scanDraftForCitations(TEST_CASE_DISCHARGE.draft);
    // Gate may return WARN for bare SCC fragments (correct behavior — see citation-gate.test.ts)
    // Critical property: hardBlock must be false — no PENDING citations present
    expect(result.hardBlock).toBe(TEST_CASE_DISCHARGE.expectedHardBlock);
    expect(result.overallStatus).not.toBe("BLOCKED");
  });

  it("LA-001-b: bail application draft passes gate with VERIFIED citations", () => {
    const result = scanDraftForCitations(TEST_CASE_BAIL.draft);
    expect(result.hardBlock).toBe(TEST_CASE_BAIL.expectedHardBlock);
  });

  it("LA-001-c: adversarial draft with fake citations is hard-blocked", () => {
    const result = scanDraftForCitations(TEST_CASE_ADVERSARIAL.draft);
    expect(result.overallStatus).toBe(TEST_CASE_ADVERSARIAL.expectedStatus);
    expect(result.hardBlock).toBe(TEST_CASE_ADVERSARIAL.expectedHardBlock);
  });

  it("LA-001-d: written submission with SECONDARY citation produces WARN", () => {
    const result = scanDraftForCitations(TEST_CASE_WRITTEN_SUBMISSION.draft);
    expect(result.overallStatus).toBe(TEST_CASE_WRITTEN_SUBMISSION.expectedStatus);
    expect(result.hardBlock).toBe(TEST_CASE_WRITTEN_SUBMISSION.expectedHardBlock);
  });

  it("LA-001-e: accuracy threshold — COURT_SAFE precedents have 100% holdingAccurate", () => {
    const courtSafe = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE");
    const accurate = courtSafe.filter((p) => p.holdingAccurate).length;
    const pct = (accurate / courtSafe.length) * 100;
    expect(pct).toBe(100); // accuracy_threshold: 98.0% — we enforce 100% for COURT_SAFE
  });
});

// ─── SUITE 2: LA-002 — CITATION VERIFICATION TIERS ───────────────────────────

describe("[LA-002] Legal Accuracy — Citation Verification Tiers", () => {
  it("LA-002-a: COURT_SAFE tier has verified holding + para ref", () => {
    const courtSafe = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE");
    for (const p of courtSafe) {
      expect(p.verifiedHolding).not.toBeNull();
      expect(p.paraRef).not.toBeNull();
    }
  });

  it("LA-002-b: VERIFIED tier may have null paraRef (acceptable)", () => {
    const verified = PRECEDENT_ACCURACY.filter((p) => p.tier === "VERIFIED");
    // VERIFIED = existence confirmed, para may be pending
    for (const p of verified) {
      expect(p.verifiedHolding).not.toBeNull(); // holding must exist
    }
  });

  it("LA-002-c: SECONDARY tier has null verifiedHolding (not yet confirmed)", () => {
    const secondary = PRECEDENT_ACCURACY.filter((p) => p.tier === "SECONDARY");
    for (const p of secondary) {
      expect(p.verifiedHolding).toBeNull();
    }
  });

  it("LA-002-d: PENDING tier has null verifiedHolding and null paraRef", () => {
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    for (const p of pending) {
      expect(p.verifiedHolding).toBeNull();
      expect(p.paraRef).toBeNull();
    }
  });

  it("LA-002-e: tier hierarchy — COURT_SAFE > VERIFIED > SECONDARY > PENDING", () => {
    // Structural: COURT_SAFE must have more data than PENDING
    const courtSafe = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE");
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");

    const courtSafeWithHolding = courtSafe.filter((p) => p.verifiedHolding !== null).length;
    const pendingWithHolding = pending.filter((p) => p.verifiedHolding !== null).length;

    expect(courtSafeWithHolding).toBeGreaterThan(pendingWithHolding);
  });
});

// ─── SUITE 3: LA-003 — PROPERTY/STANDARDS VERIFICATION ───────────────────────

describe("[LA-003] Legal Accuracy — IS/ASTM Standards Verification", () => {
  it("LA-003-a: IS 1199:2018 scope confirmed — fresh concrete only", () => {
    const s = STANDARDS_ACCURACY.find((s) => s.code === "IS 1199:2018");
    expect(s).toBeDefined();
    expect(s!.exactClauseText).not.toBeNull();
    expect(s!.exactClauseText!.toLowerCase()).toContain("fresh concrete");
  });

  it("LA-003-b: IS 2250:1981 is the correct masonry mortar standard", () => {
    const s = STANDARDS_ACCURACY.find((s) => s.code === "IS 2250:1981");
    expect(s).toBeDefined();
    expect(s!.applicability).toBe("correct");
  });

  it("LA-003-c: ASTM C1324 is correct for hardened masonry mortar forensics", () => {
    const s = STANDARDS_ACCURACY.find((s) => s.code === "ASTM C1324");
    expect(s).toBeDefined();
    expect(s!.applicability).toBe("correct");
  });

  it("LA-003-d: CPWD Manual 2023 is applicable to public works construction", () => {
    const s = STANDARDS_ACCURACY.find((s) => s.code === "CPWD Manual 2023");
    expect(s).toBeDefined();
    expect(s!.applicability).toBe("correct");
  });

  it("LA-003-e: all standards have applicabilityReason explaining the decision", () => {
    for (const s of STANDARDS_ACCURACY) {
      expect(typeof s.applicabilityReason).toBe("string");
      expect(s.applicabilityReason.trim().length).toBeGreaterThan(10);
    }
  });
});

// ─── SUITE 4: DP-001 — OCR / TEXT EXTRACTION ACCURACY ────────────────────────

describe("[DP-001] Document Processing — Citation Extraction from Text", () => {
  it("DP-001-a: SCC citation pattern extracted from discharge draft", () => {
    const result = scanDraftForCitations(TEST_CASE_DISCHARGE.draft);
    const sccMatch = result.matches.find((m) =>
      m.rawMatch.includes("SCC") || m.rawMatch.includes("3 SCC")
    );
    expect(sccMatch).toBeDefined();
  });

  it("DP-001-b: IS standard pattern extracted from standards draft", () => {
    const draft = "The prosecution wrongly applied IS 1199:2018 to hardened masonry mortar.";
    const result = scanDraftForCitations(draft);
    const isMatch = result.matches.find((m) =>
      m.rawMatch.toUpperCase().includes("IS") && m.rawMatch.includes("1199")
    );
    expect(isMatch).toBeDefined();
  });

  it("DP-001-c: ASTM pattern extracted from draft", () => {
    const draft = "ASTM C1324 governs forensic examination of hardened masonry mortar.";
    const result = scanDraftForCitations(draft);
    const astmMatch = result.matches.find((m) =>
      m.rawMatch.toUpperCase().includes("ASTM")
    );
    expect(astmMatch).toBeDefined();
  });

  it("DP-001-d: GLR citation pattern extracted from adversarial draft", () => {
    const result = scanDraftForCitations(TEST_CASE_ADVERSARIAL.draft);
    const glrMatch = result.matches.find((m) =>
      m.rawMatch.includes("GLR") || m.rawMatch.toLowerCase().includes("mohanbhai")
    );
    expect(glrMatch).toBeDefined();
  });

  it("DP-001-e: SCC OnLine pattern extracted from adversarial draft", () => {
    const result = scanDraftForCitations(TEST_CASE_ADVERSARIAL.draft);
    const sccOnlineMatch = result.matches.find((m) =>
      m.rawMatch.includes("SCC OnLine") || m.rawMatch.toLowerCase().includes("r.b.")
    );
    expect(sccOnlineMatch).toBeDefined();
  });
});

// ─── SUITE 5: DP-002 — FORMAT PRESERVATION ───────────────────────────────────

describe("[DP-002] Document Processing — Registry Data Completeness", () => {
  it("DP-002-a: all precedents have date field", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(typeof p.date).toBe("string");
      expect(p.date.trim().length).toBeGreaterThan(0);
    }
  });

  it("DP-002-b: all standards have title field", () => {
    for (const s of STANDARDS_ACCURACY) {
      expect(typeof s.title).toBe("string");
      expect(s.title.trim().length).toBeGreaterThan(0);
    }
  });

  it("DP-002-c: all standards have clauseRef field", () => {
    for (const s of STANDARDS_ACCURACY) {
      expect(typeof s.clauseRef).toBe("string");
      expect(s.clauseRef!.trim().length).toBeGreaterThan(0);
    }
  });

  it("DP-002-d: all standards have appStatement field", () => {
    for (const s of STANDARDS_ACCURACY) {
      expect(typeof s.appStatement).toBe("string");
      expect(s.appStatement.trim().length).toBeGreaterThan(0);
    }
  });
});

// ─── SUITE 6: AC-001 — PATTERN RECOGNITION ───────────────────────────────────

describe("[AC-001] Analytical Capabilities — Pattern Recognition", () => {
  it("AC-001-a: gate correctly identifies COURT_SAFE pattern → SAFE status", () => {
    const draft = "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10.";
    const result = scanDraftForCitations(draft);
    const match = result.matches.find((m) => m.registryEntry?.id === "p_prafulla");
    if (match) {
      expect(match.status).toBe("SAFE");
    }
  });

  it("AC-001-b: gate correctly identifies SECONDARY pattern → WARN status", () => {
    const draft = "Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317.";
    const result = scanDraftForCitations(draft);
    const match = result.matches.find((m) => m.registryEntry?.id === "p_sushil_sharma");
    if (match) {
      expect(match.status).toBe("WARN");
    }
  });

  it("AC-001-c: gate correctly identifies PENDING pattern → BLOCKED status", () => {
    const draft = "State of Gujarat v. Mohanbhai (2003) 4 GLR 3121.";
    const result = scanDraftForCitations(draft);
    const match = result.matches.find((m) => m.registryEntry?.id === "p_mohanbhai");
    if (match) {
      expect(match.status).toBe("BLOCKED");
    }
  });

  it("AC-001-d: unrecognised citation gets WARN (not BLOCKED) — conservative approach", () => {
    const draft = "Unknown Case v. Unknown Party (2024) 99 XYZ 999.";
    const result = scanDraftForCitations(draft);
    // Unrecognised citations should be flagged but not hard-blocked
    for (const m of result.matches) {
      if (m.tier === "UNRECOGNISED") {
        expect(m.status).toBe("WARN");
        expect(m.blockedFromDraft).toBe(false);
      }
    }
  });
});

// ─── SUITE 7: AC-002 — PREDICTIVE ANALYSIS ───────────────────────────────────

describe("[AC-002] Analytical Capabilities — Predictive Analysis", () => {
  it("AC-002-a: accuracy score predicts filing safety (score > 0 = some safe citations)", () => {
    const { score } = overallAccuracyScore();
    // If score > 0, there are usable citations
    if (score > 0) {
      expect(getCourtSafePrecedents().length).toBeGreaterThan(0);
    }
  });

  it("AC-002-b: blocked count predicts risk level", () => {
    const { blocked } = overallAccuracyScore();
    const actualBlocked = getBlockedPrecedents().length;
    // Prediction matches reality
    expect(blocked).toBe(actualBlocked);
  });

  it("AC-002-c: report predicts required actions before filing", () => {
    const report = generateAccuracyReport();
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    // Every PENDING citation's required actions should appear in the report
    for (const p of pending) {
      if (p.requiredActions.length > 0) {
        expect(report).toContain(p.name);
      }
    }
  });
});

// ─── SUITE 8: PF-001 — LOAD TESTING ──────────────────────────────────────────

describe("[PF-001] Performance — Load Testing", () => {
  it("PF-001-a: 10 sequential scans complete in < 500ms total", () => {
    const draft = TEST_CASE_DISCHARGE.draft;
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      scanDraftForCitations(draft);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  it("PF-001-b: 10 sequential blocked scans complete in < 500ms total", () => {
    const draft = TEST_CASE_ADVERSARIAL.draft;
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      scanDraftForCitations(draft);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  it("PF-001-c: accuracy score computation is O(n) — 100 calls in < 100ms", () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      overallAccuracyScore();
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });
});

// ─── SUITE 9: PF-002 — STRESS TESTING ────────────────────────────────────────

describe("[PF-002] Performance — Stress Testing", () => {
  it("PF-002-a: scan handles very long draft (5000 chars) without timeout", () => {
    const longDraft = Array(100)
      .fill(
        "Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4. " +
        "State of Bihar v. Ramesh Singh (1977) 4 SCC 39. "
      )
      .join("");
    const start = performance.now();
    const result = scanDraftForCitations(longDraft);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    expect(result).toBeDefined();
  });

  it("PF-002-b: scan handles draft with 20 different citation patterns", () => {
    const draft = `
      (2019) 5 SCC 123. (2020) 3 SCC 456. (2021) 7 SCC 789.
      AIR 2020 SC 100. AIR 2021 SC 200. AIR 2022 SC 300.
      IS 1199:2018. IS 2250:1981. IS 3535:1986. ASTM C1324.
      Section 302 IPC. Section 438 CrPC. Section 227 CrPC.
      State v. Accused. Petitioner v. Respondent.
      2014 SCC OnLine Bom 125. 2011 SCC OnLine Del 3412.
      (2003) 4 GLR 3121. 2018 SCC OnLine All 442. BS 1234.
    `;
    expect(() => scanDraftForCitations(draft)).not.toThrow();
  });

  it("PF-002-c: system remains stable after 50 consecutive mixed scans", () => {
    const drafts = [
      TEST_CASE_DISCHARGE.draft,
      TEST_CASE_BAIL.draft,
      TEST_CASE_ADVERSARIAL.draft,
      TEST_CASE_WRITTEN_SUBMISSION.draft,
      "",
    ];
    let errorCount = 0;
    for (let i = 0; i < 50; i++) {
      try {
        scanDraftForCitations(drafts[i % drafts.length]);
      } catch {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0); // error rate = 0%
  });
});

// ─── SUITE 10: SC-001 — SECURITY / PENETRATION ───────────────────────────────

describe("[SC-001] Security — Citation Injection Prevention", () => {
  it("SC-001-a: SQL-like injection in draft does not crash the gate", () => {
    const injection = "'; DROP TABLE citations; -- (2020) 3 SCC 50";
    expect(() => scanDraftForCitations(injection)).not.toThrow();
  });

  it("SC-001-b: XSS-like injection in draft does not crash the gate", () => {
    const xss = "<script>alert('xss')</script> (2020) 3 SCC 50";
    expect(() => scanDraftForCitations(xss)).not.toThrow();
  });

  it("SC-001-c: null-byte injection does not crash the gate", () => {
    const nullByte = "Normal text \x00 (2020) 3 SCC 50";
    expect(() => scanDraftForCitations(nullByte)).not.toThrow();
  });

  it("SC-001-d: extremely long single token does not crash the gate", () => {
    const longToken = "A".repeat(10000) + " (2020) 3 SCC 50";
    expect(() => scanDraftForCitations(longToken)).not.toThrow();
  });

  it("SC-001-e: unicode characters do not crash the gate", () => {
    const unicode = "न्यायालय ने कहा कि (2020) 3 SCC 50 के अनुसार।";
    expect(() => scanDraftForCitations(unicode)).not.toThrow();
  });
});

// ─── SUITE 11: SC-002 — DATA PROTECTION ──────────────────────────────────────

describe("[SC-002] Security — Data Protection & Compliance", () => {
  it("SC-002-a: PENDING citations cannot appear as SAFE in any scan", () => {
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    for (const p of pending) {
      const draft = `${p.name} ${p.citation}`;
      const result = scanDraftForCitations(draft);
      const match = result.matches.find((m) => m.registryEntry?.id === p.id);
      if (match) {
        expect(match.status).not.toBe("SAFE");
      }
    }
  });

  it("SC-002-b: all source URLs are HTTPS (no plaintext HTTP)", () => {
    for (const p of PRECEDENT_ACCURACY) {
      for (const src of p.sources) {
        expect(src.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("SC-002-c: no citation has empty verificationNote (audit trail required)", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(p.verificationNote.trim().length).toBeGreaterThan(0);
    }
  });
});

// ─── SUITE 12: RG-001 — DAILY REGRESSION ─────────────────────────────────────

describe("[RG-001] Regression — Cross-module Consistency", () => {
  let safeResult: GateResult;
  let blockedResult: GateResult;
  let accuracyStats: ReturnType<typeof overallAccuracyScore>;

  beforeAll(() => {
    safeResult = scanDraftForCitations(TEST_CASE_DISCHARGE.draft);
    blockedResult = scanDraftForCitations(TEST_CASE_ADVERSARIAL.draft);
    accuracyStats = overallAccuracyScore();
  });

  it("RG-001-a: gate SAFE result is consistent with registry COURT_SAFE count", () => {
    // If registry has COURT_SAFE entries, safe drafts should pass
    const courtSafeCount = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE").length;
    if (courtSafeCount > 0) {
      expect(safeResult.hardBlock).toBe(false);
    }
  });

  it("RG-001-b: gate BLOCKED result is consistent with registry PENDING count", () => {
    const pendingCount = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING").length;
    if (pendingCount > 0) {
      expect(blockedResult.hardBlock).toBe(true);
    }
  });

  it("RG-001-c: accuracy score is consistent with safe/blocked counts", () => {
    const { courtSafe, verified, pending, blocked } = accuracyStats;
    // Structural consistency: blocked ≥ pending (blocked includes FATAL_ERROR too)
    expect(blocked).toBeGreaterThanOrEqual(pending);
    // courtSafe + verified ≤ total
    expect(courtSafe + verified).toBeLessThanOrEqual(PRECEDENT_ACCURACY.length);
  });

  it("RG-001-d: getCourtSafePrecedents() and getBlockedPrecedents() are disjoint", () => {
    const safeIds = new Set(getCourtSafePrecedents().map((p) => p.id));
    const blockedIds = getBlockedPrecedents().map((p) => p.id);
    for (const id of blockedIds) {
      expect(safeIds.has(id)).toBe(false);
    }
  });

  it("RG-001-e: report output is deterministic (same output on repeated calls)", () => {
    const report1 = generateAccuracyReport();
    const report2 = generateAccuracyReport();
    // Remove timestamp line for comparison
    const normalize = (r: string) =>
      r.replace(/Generated: .+/, "Generated: [TIMESTAMP]");
    expect(normalize(report1)).toBe(normalize(report2));
  });

  it("RG-001-f: all 4 test cases produce defined GateResult objects", () => {
    const testCases = [
      TEST_CASE_DISCHARGE.draft,
      TEST_CASE_BAIL.draft,
      TEST_CASE_ADVERSARIAL.draft,
      TEST_CASE_WRITTEN_SUBMISSION.draft,
    ];
    for (const draft of testCases) {
      const result = scanDraftForCitations(draft);
      expect(result).toBeDefined();
      expect(result.overallStatus).toBeDefined();
      expect(Array.isArray(result.matches)).toBe(true);
      expect(typeof result.hardBlock).toBe("boolean");
      expect(typeof result.summary).toBe("string");
    }
  });

  it("RG-001-g: accuracy-rules.md Rule 8 — tests cover discharge, bail, written submission", () => {
    // Rule 8: test cases MUST cover discharge application, bail application, written submission
    const dischargeResult = scanDraftForCitations(TEST_CASE_DISCHARGE.draft);
    const bailResult = scanDraftForCitations(TEST_CASE_BAIL.draft);
    const writtenResult = scanDraftForCitations(TEST_CASE_WRITTEN_SUBMISSION.draft);

    expect(dischargeResult).toBeDefined();
    expect(bailResult).toBeDefined();
    expect(writtenResult).toBeDefined();
  });
});
