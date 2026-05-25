export const HARVEY_LAB_SOURCE_URL =
  "https://www.harvey.ai/blog/introducing-harveys-legal-agent-benchmark";

export const HARVEY_EVALUATION_BOUNDARY =
  "This workspace should not provide case-specific negligence strategy or advice on how to save a client in an active matter. It can support legal teams with record organization, inconsistency detection, chronology building, deposition-topic preparation, document-request outlines, and counsel-review work product.";

export const HARVEY_LAB_FACTS = [
  {
    label: "Client-matter workspace",
    detail:
      "LAB frames each assignment around a closed universe of matter files, templates, emails, and other materials that the agent must discover and use.",
  },
  {
    label: "Reviewable work product",
    detail:
      "Tasks require a concrete deliverable, such as a memo or issue list, suitable for partner or client review rather than a loose answer.",
  },
  {
    label: "Expert rubric checks",
    detail:
      "Evaluation is based on expert-written binary criteria covering facts, conclusions, citations, recommendations, amounts, deadlines, and formatting.",
  },
  {
    label: "All-pass grading",
    detail:
      "A task is complete only when every required criterion passes, reflecting how high-stakes legal work is reviewed in practice.",
  },
];

export const LEGAL_TEAM_WORKFLOWS = [
  "Organize expert, inspection, standards, and site reports by issue and source.",
  "Identify internal inconsistencies across work orders, photos, weather logs, lab reports, and correspondence.",
  "Build a dated chronology from the record with source references and open evidence gaps.",
  "Draft deposition and cross-examination topics for counsel review based on the closed record.",
  "Prepare structured document requests, issue outlines, and review checklists without giving case-specific legal advice.",
];

export const LAB_STYLE_READINESS_CHECKS = [
  "Matter files are grouped in a closed workspace before drafting begins.",
  "Every conclusion has a source anchor or is marked as an assumption.",
  "Contradictions are surfaced separately from recommendations.",
  "Drafts route through human review before filing or client use.",
  "Rubrics test completeness, citation support, factual accuracy, and privilege-safe wording.",
];
