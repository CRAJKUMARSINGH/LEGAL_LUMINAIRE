import { describe, it, expect } from "vitest";
import { ACADEMY_SCENARIOS } from "../features/academy/data/scenarios";

describe("Accuracy Academy - Data & Trade-Off Meter Integrity", () => {
  it("contains exactly 3 high-impact branching scenarios", () => {
    expect(ACADEMY_SCENARIOS.length).toBe(3);
  });

  it("ensures every scenario has 4 distinct options with explicit costs (AI Law pattern)", () => {
    ACADEMY_SCENARIOS.forEach((scenario) => {
      expect(scenario.options.length).toBe(4);
      const letters = scenario.options.map((o) => o.letter);
      expect(letters).toEqual(["A", "B", "C", "D"]);

      scenario.options.forEach((opt) => {
        // Must have non-empty titles and actions
        expect(opt.titleEn.length).toBeGreaterThan(0);
        expect(opt.titleHi.length).toBeGreaterThan(0);
        expect(opt.actionEn.length).toBeGreaterThan(0);
        expect(opt.actionHi.length).toBeGreaterThan(0);

        // Explicit cost must be defined (AI Law requirement)
        expect(opt.costEn.length).toBeGreaterThan(0);
        expect(opt.costHi.length).toBeGreaterThan(0);

        // Trade-off breakdown fields
        expect(opt.optimizedForEn.length).toBeGreaterThan(0);
        expect(opt.sacrificedEn.length).toBeGreaterThan(0);

        // All 3 meters must have deltas
        expect(typeof opt.deltas.verificationDepth).toBe("number");
        expect(typeof opt.deltas.timeSpent).toBe("number");
        expect(typeof opt.deltas.clientSafety).toBe("number");

        // Linked in-app feature must exist with valid path
        expect(opt.linkedFeature.nameEn.length).toBeGreaterThan(0);
        expect(opt.linkedFeature.path.startsWith("/")).toBe(true);
        expect(opt.linkedFeature.badge.length).toBeGreaterThan(0);
      });
    });
  });

  it("verifies bilingual completeness across all scenarios and context cards", () => {
    ACADEMY_SCENARIOS.forEach((scenario) => {
      expect(scenario.titleEn).toBeTruthy();
      expect(scenario.titleHi).toBeTruthy();
      expect(scenario.contextCard.situationEn).toBeTruthy();
      expect(scenario.contextCard.situationHi).toBeTruthy();
      expect(scenario.contextCard.urgencyEn).toBeTruthy();
      expect(scenario.contextCard.urgencyHi).toBeTruthy();
      expect(scenario.teachingPointEn).toBeTruthy();
      expect(scenario.teachingPointHi).toBeTruthy();
    });
  });

  it("verifies delta trade-off ranges and non-zero costs", () => {
    ACADEMY_SCENARIOS.forEach((scenario) => {
      scenario.options.forEach((opt) => {
        const { verificationDepth, timeSpent, clientSafety } = opt.deltas;
        // In AI Law model, no choice is free - at least one delta is negative or carries genuine cost
        const hasCost = verificationDepth < 0 || timeSpent < 0 || clientSafety < 0;
        expect(hasCost).toBe(true);
      });
    });
  });

  it("ensures scenario 1 covers copilot draft verification", () => {
    const s1 = ACADEMY_SCENARIOS[0];
    expect(s1.id).toBe("scenario-1");
    expect(s1.options.some((o) => o.linkedFeature.badge === "Verification Panel")).toBe(true);
  });

  it("ensures scenario 2 covers PENDING citation deadline quarantine", () => {
    const s2 = ACADEMY_SCENARIOS[1];
    expect(s2.id).toBe("scenario-2");
    expect(s2.options.some((o) => o.linkedFeature.badge === "Deadline Board")).toBe(true);
  });

  it("ensures scenario 3 covers forensic standards exploration", () => {
    const s3 = ACADEMY_SCENARIOS[2];
    expect(s3.id).toBe("scenario-3");
    expect(s3.options.some((o) => o.linkedFeature.badge.includes("Standards") || o.linkedFeature.badge.includes("FAQ"))).toBe(true);
  });
});
