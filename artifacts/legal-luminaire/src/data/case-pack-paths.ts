/**
 * Monorepo paths (relative to LEGAL_LUMINAIRE root) for linking UI to on-disk packs.
 * - real_cases/ — Hemraj, Pitambara, infra arbitration document bundles
 * - sample_cases/ — synthetic TC specs (functional / edge / stress / showcase),
 *   test fixtures, marketing collateral, and misc templates
 */
export const SAMPLE_CASE_LIBRARY_ROOT = "sample_cases";

/** Full document pack folder for a demo card id (TC-01, TC-22 … TC-26). */
export const REPO_PACK_BY_DEMO_ID: Partial<Record<string, string>> = {
  "TC-01": "real_cases/CASE01_HEMRAJ_STATE_2025",
  "TC-22": "real_cases/INFRA_ARB_01_BUILDING_HOSPITAL_2026",
  "TC-23": "real_cases/INFRA_ARB_02_ROAD_HIGHWAY_2026",
  "TC-24": "real_cases/INFRA_ARB_03_DAM_IRRIGATION_2026",
  "TC-25": "real_cases/INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026",
  "TC-26": "real_cases/INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026",
};

export function syntheticSpecHint(demoId: string): string {
  return `${SAMPLE_CASE_LIBRARY_ROOT}/ — spec for ${demoId} (functional / edge / stress / showcase)`;
}
