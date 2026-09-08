/**
 * Week 1 — Feature Flag System
 * ─────────────────────────────
 * Single source of truth for every feature flag introduced in the
 * 12-week Legal Luminaire integration plan.
 *
 * Rules:
 *   • All flags default OFF — experimental features never destabilise the
 *     Netlify production demo.
 *   • Flags are typed as a const object — no stringly-typed lookups.
 *   • Override any flag locally with the corresponding VITE_FF_* env var.
 *   • The hidden /system/flags dev route (see routes.tsx) lets you toggle
 *     flags at runtime without touching .env.
 *
 * Flag registry (Week 1):
 *   redaction_studio   — W2  client-side PII redaction + recompile
 *   smart_drop         — W3  document drop classification + register proposal
 *   ask_copilot        — W5–8 grounded case-book Q&A copilot
 *   citation_deeplink  — W7  every citation links to source PDF
 *   deadline_engine    — W9  limitation periods, synthetic dates only
 *   chronology_studio  — W10 chronology + board + calendar
 *   standards_explorer — W11 standards browse, plain-language, honest framing
 *   accuracy_academy   — W12 branching walkthrough + trade-off meters
 */

const env = import.meta.env;

/** Read a VITE_FF_* env var; return defaultValue if absent or unrecognised. */
function flag(value: unknown, defaultValue = false): boolean {
  if (typeof value !== "string") return defaultValue;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export const integrationFlags = {
  /** W2 — Client-side PII redaction + document recompilation (no AI, in-browser only) */
  redaction_studio: flag(env.VITE_FF_REDACTION_STUDIO, false),

  /** W3 — Document drop classification + case-register proposal */
  smart_drop: flag(env.VITE_FF_SMART_DROP, false),

  /** W5–8 — Grounded read-only copilot over the active case book */
  ask_copilot: flag(env.VITE_FF_ASK_COPILOT, false),

  /** W7 — Every citation deep-links to its source document page */
  citation_deeplink: flag(env.VITE_FF_CITATION_DEEPLINK, false),

  /** W9 — Limitation-period + procedural deadline engine (synthetic dates only) */
  deadline_engine: flag(env.VITE_FF_DEADLINE_ENGINE, false),

  /** W10 — Interactive chronology editor: list, board, and calendar views */
  chronology_studio: flag(env.VITE_FF_CHRONOLOGY_STUDIO, false),

  /** W11 — IS/ASTM/NABL standards browser with plain-language summaries */
  standards_explorer: flag(env.VITE_FF_STANDARDS_EXPLORER, false),

  /** W12 — Accuracy Academy: branching walkthroughs + trade-off meters */
  accuracy_academy: flag(env.VITE_FF_ACCURACY_ACADEMY, false),
} as const;

/** Compile-time type of the integration flag registry. */
export type IntegrationFlags = typeof integrationFlags;

/**
 * Bilingual display labels for the /system/flags dev route.
 * Each entry maps a flag key to { en, hi } labels.
 */
export const integrationFlagLabels: Record<
  keyof IntegrationFlags,
  { en: string; hi: string; week: string }
> = {
  redaction_studio: {
    en: "Redaction Studio",
    hi: "संशोधन स्टूडियो",
    week: "W2",
  },
  smart_drop: {
    en: "Smart Drop",
    hi: "स्मार्ट ड्रॉप",
    week: "W3",
  },
  ask_copilot: {
    en: "Ask Copilot",
    hi: "सहायक से पूछें",
    week: "W5–8",
  },
  citation_deeplink: {
    en: "Citation Deep-Link",
    hi: "उद्धरण डीप-लिंक",
    week: "W7",
  },
  deadline_engine: {
    en: "Deadline Engine",
    hi: "समय-सीमा इंजन",
    week: "W9",
  },
  chronology_studio: {
    en: "Chronology Studio",
    hi: "कालक्रम स्टूडियो",
    week: "W10",
  },
  standards_explorer: {
    en: "Standards Explorer",
    hi: "मानक अन्वेषक",
    week: "W11",
  },
  accuracy_academy: {
    en: "Accuracy Academy",
    hi: "सटीकता अकादमी",
    week: "W12",
  },
};
