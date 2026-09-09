export type MeterKey = "verificationDepth" | "timeSpent" | "clientSafety";

export interface MeterDeltas {
  verificationDepth: number; // e.g. -20 to +30
  timeSpent: number;         // e.g. -30 (takes long) to +20 (instant)
  clientSafety: number;      // e.g. -35 (fatal risk) to +30 (bulletproof)
}

export interface ScenarioOption {
  id: string;
  letter: "A" | "B" | "C" | "D";
  titleEn: string;
  titleHi: string;
  actionEn: string;
  actionHi: string;
  costEn: string;
  costHi: string;
  deltas: MeterDeltas;
  consequenceEn: string;
  consequenceHi: string;
  optimizedForEn: string;
  optimizedForHi: string;
  sacrificedEn: string;
  sacrificedHi: string;
  linkedFeature: {
    nameEn: string;
    nameHi: string;
    path: string;
    descriptionEn: string;
    descriptionHi: string;
    badge: string;
  };
}

export interface Scenario {
  id: string;
  moduleCode: string;
  moduleTitleEn: string;
  moduleTitleHi: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  contextCard: {
    badgeEn: string;
    badgeHi: string;
    situationEn: string;
    situationHi: string;
    syntheticArtifactSnippet?: string;
    urgencyEn: string;
    urgencyHi: string;
  };
  options: ScenarioOption[];
  teachingPointEn: string;
  teachingPointHi: string;
}

export interface AcademyState {
  currentScenarioIndex: number;
  selectedOptionId: string | null;
  history: Record<string, string>; // scenarioId -> optionId
  language: "en" | "hi";
  meters: {
    verificationDepth: number;
    timeSpent: number;
    clientSafety: number;
  };
}
