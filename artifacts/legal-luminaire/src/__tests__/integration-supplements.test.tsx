import { describe, it, expect } from "vitest";
import DefenseBrief from "@/pages/DefenseBrief";
import FslAnalysis from "@/pages/FslAnalysis";
import CrossCheckReport from "@/pages/CrossCheckReport";
import StandardsIndex from "@/pages/StandardsIndex";

describe("Integrated Supplement Pages Compilation Tests", () => {
  it("imports DefenseBrief successfully", () => {
    expect(DefenseBrief).toBeDefined();
  });

  it("imports FslAnalysis successfully", () => {
    expect(FslAnalysis).toBeDefined();
  });

  it("imports CrossCheckReport successfully", () => {
    expect(CrossCheckReport).toBeDefined();
  });

  it("imports StandardsIndex successfully", () => {
    expect(StandardsIndex).toBeDefined();
  });
});
