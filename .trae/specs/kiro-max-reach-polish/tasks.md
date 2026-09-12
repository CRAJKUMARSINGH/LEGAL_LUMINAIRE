# Kiro Max-Reach Polish - Implementation Plan

## Task 1: Draft Magnetic Titles / Taglines / One-Liners Deliverable Set
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None (informational — feeds Task 2 README hero section)
- **Description**:
  - Based on the full repo analysis, draft the complete titles/taglines deliverable set as specified in FR-2 and AC-3.
  - Include: Hero Title (1), Repo Description (1), Alternative Taglines (5–8), Elevator Pitch (2–4 sentences).
  - Provide a "Why it fits" 1-sentence rationale for each.
  - Pick a #1 top recommendation and justify.
  - Place content at the very top of README.md in a clearly-labeled "✨ Magnetic Titles (Suggestions)" section, then apply the #1 pick as the actual H1/tagline of the README.
- **Acceptance Criteria Addressed**: AC-3, AC-10
- **Test Requirements**:
  - `rule` TR-1.1: Count of Hero Title (1) + Repo Description (1) + Alternative Taglines (≥5) + Elevator Pitch (2–4 sentences) + top-pick reasoning (≥1 paragraph) ≥ minimums; each item has a "Why it fits" sentence. Evidence: README.md subsection lines with items numbered and labeled.
  - `rubric` TR-1.2: Dimension = Tagline punch & SEO keyword inclusion; scale 1–5; anchors 1=generic/no keywords, 3=decent, 5=every tagline <15 words, includes ≥2 domain keywords, benefit-first tone; threshold >= 4; evidence = manual review of each tagline's word count and keywords.
- **Notes**: Apply the #1 pick as the actual H1 so the README hero is production-ready; the suggestion section clearly says it's optional variants.

## Task 2: Rewrite README.md with Full 14-Section Modern Structure
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (uses #1 pick for hero)
- **Description**:
  - Create a brand-new README.md at repo root following FR-1 section order exactly.
  - Hero: Apply Task 1 #1 pick (emoji + Legal Luminaire + killer one-liner) + expanded badges row (language, license, React 19, FastAPI, build status [Netlify/CI workflow], test status [Vitest 343/343], Made-for-Indian-Courts, bilingual Hindi+English, pnpm monorepo — placeholder URLs with note where needed).
  - ✨ What makes this brilliant? paragraph: Lead with the Hemraj IS 2250:1981 vs IS 1199:2018 example — "That's not a feature. That's a weapon." — tie to dual-expert creator.
  - 🚀 Key Features: ≥10 emoji bullets covering: 5-tier verification with auto-block, Fact-Fit Gate, forensic standards guard, 55+ routes, 26 demo cases, bilingual UI, 4-step guided workflow, court-ready drafts + verification report + checklist, local-first demo zero-API-keys, multi-case system, Accuracy Academy, Chronology Studio + Deadline Engine, Citation Graph + Case Similarity + Judge Analytics, Infrastructure Arbitration modules (LDR, LPS), 343/343 tests Netlify CI.
  - 📸 Demo / Screenshots: 2–3 placeholder image lines using relative `docs/assets/screenshot-*.png` paths (OK if files don't exist — user will upload), plus 1 GIF placeholder (`docs/assets/demo.gif`), plus a clear 1-paragraph suggestion to record 20–40s screen recording of Hemraj demo flow: Home → Intake → Research → Discharge → Print.
  - ⚡ Quick Start: Numbered steps with Windows (PowerShell) AND macOS/Linux (bash) labels on every shell block. Steps: (1) Prerequisites (Node 22, pnpm 10, Python 3.11 for full-stack optional), (2) Clone, (3) Install deps (pnpm install --frozen-lockfile), (4) Run frontend dev, (5) Open localhost:5173 → click Demo Mode. Keep text under 90-second-read estimate. Add optional full-stack backend steps clearly labeled OPTIONAL.
  - 📖 How to Use: 4 practical workflows with sub-headings + commands / steps: (A) Running the Hemraj Stadium Collapse Demo, (B) Generating a Discharge Application, (C) Using Citation Verification Gate + Cross-Ref Matrix, (D) Multi-case: Switching Between the 26 Demo Cases. Include copy-paste example: how to seed a new case (reference scripts/).
  - 🔧 Configuration / Options: Environment variable table — OPENAI_API_KEY, TAVILY_API_KEY, VITE_FF_* feature flags (from featureFlags.ts list), Docker Compose note, netlify.toml preconfigured.
  - 🛠 Tech Stack: 2-column table. Frontend: React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Radix UI, Recharts, Framer Motion, Zustand, Wouter, Zod, Vitest. Backend: FastAPI, CrewAI, LangChain, ChromaDB, Python 3.11. Deploy: Netlify, Vercel, Docker Compose, GitHub Actions (CI).
  - 🗺 Roadmap: Based on existing 8 feature flags (redaction_studio, smart_drop, ask_copilot, citation_deeplink, deadline_engine, chronology_studio, standards_explorer, accuracy_academy) — mark deadline_engine, chronology_studio, accuracy_academy as SHIPPED; mark the other 5 as "Upcoming — flip VITE_FF_*=true to preview". Add stretch goals: Multi-user workspace, Indian Kanoon live API, Harvey.ai bi-directional sync, PDF signature overlay, Mobile PWA.
  - 🤝 How to Contribute: Warm welcome paragraph + link to CONTRIBUTING.md + "Join our accuracy-first community".
  - 📜 License: MIT, link to LICENSE, "Copyright (c) 2026 Rajkumar Singh Chauhan".
  - ❤️ Shout-outs: Dual-expert creator bio mini-card (preserve existing B.E. Civil + LL.B. line), thank open-source legal-tech community, specifically mention Indian Judiciary's open data, and thank the 4 AI collaborators (Kiro, Devin, Trae, Antigravity) from the 12-week integration.
  - ⭐ CTA: "If Legal Luminaire saves you hours of research or one citation mistake — star the repo and share it with a fellow advocate! ⚖️🔥"
  - Footer hashtag row: preserve/update existing.
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-8, AC-9, AC-10
- **Test Requirements**:
  - `rule` TR-2.1: README.md exists at repo root. Evidence: `ls README.md`.
  - `rule` TR-2.2: 13 H2 headings in exact order from spec FR-1 section titles (after hero). Evidence: `grep "^## " README.md` output pasted as-is into completion evidence.
  - `rule` TR-2.3: Top of README contains H1 with emoji + "Legal Luminaire", ≤30-word tagline, ≥4 shields.io badge URLs. Evidence: README lines 1–40 excerpt.
  - `rule` TR-2.4: "What makes this brilliant?" section contains both IS 2250:1981 and IS 1199:2018 strings. Evidence: grep output for both standards numbers.
  - `rule` TR-2.5: Hemraj quote line "That's not a feature. That's a weapon." appears exactly once. Evidence: grep output.
  - `rule` TR-2.6: Accuracy 5-tier table (COURT_SAFE/VERIFIED/SECONDARY/PENDING/FATAL_ERROR) present. Evidence: table lines in README.
  - `rule` TR-2.7: Creator quote "I built this because I needed it. Every accuracy rule in this app is a scar from a real case." retained verbatim. Evidence: string-exact match.
  - `rubric` TR-2.8: Dimension = Quick Start OS coverage and copy-paste; scale 1–5; anchors per AC-8; threshold >= 4; evidence = README Quick Start code blocks with OS labels.
  - `rubric` TR-2.9: Dimension = Scannability; scale 1–5; anchors per AC-9; threshold >= 4; evidence = full README paragraph length/formatting audit.
- **Notes**: Existing README content is a great foundation — preserve factual integrity of ALL numbers (26 cases, 55 routes, 343 tests, 5 tiers, case names) and expand formatting only.

## Task 3: Rewrite CONTRIBUTING.md (Modern, Welcoming, Preserves 4 Ground Rules Verbatim)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Rewrite CONTRIBUTING.md at repo root.
  - Open with warm "Welcome" paragraph.
  - "Code of Conduct" section → link to ./CODE_OF_CONDUCT.md.
  - "Ground Rules (Accuracy + Safety — NON-NEGOTIABLE)" section → paste the 4 existing ground rules WORD-FOR-WORD from current CONTRIBUTING.md (no edits):
    1. No fabricated citations: any legal authority added must be traceable and verifiable.
    2. Synthetic vs real: demo assets must be clearly marked SYNTHETIC / DEMO.
    3. No secrets: do not commit .env, API keys, credentials, or private case documents.
    4. Respect governance: follow docs/accuracy-governance/ACCURACY_RULES.md.
  - "Dev Quickstart" → split into Frontend and Backend, each with Windows (PowerShell) and macOS/Linux labeled blocks. Keep current commands exactly, add OS labels.
  - "Pull Request Guidelines" → keep existing "small + focused, test plan, describe prompt/agent impact" rules, add: (a) PR title format `[area] description`, (b) mention changelog, (c) link to issue if exists.
  - "Adding Demo / Test Assets" → keep existing rules, add: (a) templates → `test-assets/`, (b) name stability, Windows case-insensitive note.
  - "Bug Reports & Feature Requests" → link to new YAML issue templates.
  - "Community" → warm closing, invite PRs, mention accuracy-first culture.
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-3.1: CONTRIBUTING.md exists. Evidence: ls.
  - `rule` TR-3.2: All 8 required H2 sections from FR-3 present (Welcome, Code of Conduct, Ground Rules, Dev Quickstart, PR Guidelines, Adding Demo Assets, Bug Reports & Feature Requests, Community). Evidence: `grep "^## " CONTRIBUTING.md` output.
  - `rule` TR-3.3: 4 ground rules strings match current CONTRIBUTING.md exactly (4-way exact-match, 0 diff). Evidence: diff output of old 4-rule block vs new 4-rule block — empty.
  - `rubric` TR-3.4: Dimension = Welcoming tone for new contributors; scale 1–5; anchors: 1=curt/rules-only, 3=neutral, 5=warm welcome, emoji, explicit "we welcome first-time contributors" sentence; threshold >= 4; evidence = opening paragraph of CONTRIBUTING.
- **Notes**: Preserve PowerShell syntax in current file — don't convert bash-only.

## Task 4: Create CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Create CODE_OF_CONDUCT.md at repo root.
  - Use Contributor Covenant v2.1 standard text verbatim (the public template).
  - Enforcement contact: direct to "project maintainers via GitHub Issues (tag @CRAJKUMARSINGH)" as the initial enforcement channel — avoid exposing personal email.
  - Attribution footer: "This Code of Conduct is adapted from the Contributor Covenant, version 2.1, available at https://www.contributor-covenant.org/version/2/1/code_of_conduct.html".
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-4.1: CODE_OF_CONDUCT.md exists at repo root. Evidence: ls.
  - `rule` TR-4.2: File contains strings "Contributor Covenant", "2.1", "Enforcement", "Attribution". Evidence: 4 grep matches.
  - `rule` TR-4.3: Enforcement section does NOT contain a plain email address; references GitHub Issues and/or @CRAJKUMARSINGH. Evidence: grep for `@` + contact block review.
- **Notes**: Standard CC v2.1. No embellishments needed beyond enforcement contact.

## Task 5: Convert Issue Templates to Modern GitHub YAML Format (.yml)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Create `.github/ISSUE_TEMPLATE/bug_report.yml`.
    - `name: "🐛 Bug Report"`
    - `description: "Report a bug in Legal Luminaire"`
    - `title: "[bug] "`
    - `labels: ["bug"]`
    - `body:`
      - `type: markdown` → welcome text
      - `type: input` → `id: summary`, label Summary, required: true
      - `type: textarea` → `id: steps`, label "Steps to reproduce", placeholder "1. Go to...\n2. Click on...\n3. See error", required: true
      - `type: textarea` → `id: expected`, label "Expected behavior", required: true
      - `type: textarea` → `id: actual`, label "Actual behavior", required: true
      - `type: dropdown` → `id: os`, label OS, options: Windows, macOS, Linux, Other
      - `type: input` → `id: node`, label "Node.js version"
      - `type: input` → `id: python`, label "Python version (if using backend)"
      - `type: dropdown` → `id: browser`, label Browser, options: Chrome, Firefox, Edge, Safari, Other
      - `type: textarea` → `id: logs`, label "Logs / screenshots"
  - Create `.github/ISSUE_TEMPLATE/feature_request.yml`.
    - `name: "💡 Feature Request"`
    - `description: "Suggest a feature or improvement"`
    - `title: "[feat] "`
    - `labels: ["enhancement"]`
    - `body:`
      - `type: markdown` → welcome text
      - `type: textarea` → `id: problem`, label "What problem does this solve?", required: true
      - `type: textarea` → `id: solution`, label "Proposed solution", required: true
      - `type: textarea` → `id: alternatives`, label "Alternatives you've considered"
      - `type: checkboxes` → `id: accuracy`, label "Accuracy / Governance Impact", options:
        - "Affects citation verification tiers (VERIFIED / SECONDARY / PENDING)"
        - "Affects Fact-Fit Gate scoring"
        - "Adds new legal authority citations requiring verification"
        - "No accuracy impact — docs/UI/refactor only"
      - `type: textarea` → `id: context`, label "Additional context"
  - Keep the existing `.md` templates — do NOT delete them. Safer to have both; user can delete .md later if desired.
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-5.1: Both `bug_report.yml` and `feature_request.yml` exist under `.github/ISSUE_TEMPLATE/`. Evidence: `ls .github/ISSUE_TEMPLATE/`.
  - `rule` TR-5.2: bug_report.yml has field IDs: summary, steps, expected, actual, os, node, python, browser, logs. Evidence: YAML parsed list of IDs.
  - `rule` TR-5.3: feature_request.yml has field IDs: problem, solution, alternatives, accuracy, context. Evidence: YAML parsed list of IDs.
  - `rule` TR-5.4: Existing .md templates untouched. Evidence: both `bug_report.md` and `feature_request.md` still present (compare to prior listing).
- **Notes**: YAML indentation matters — use 2-space, validate visually.

## Task 6: Produce Repo Metadata Recommendations (Description + Topics + Next Steps)
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 1 (reuses tagline/description text)
- **Description**:
  - This task produces a clearly-labeled section in the final implementation summary (shown to user in conversation, not as a committed file).
  - **GitHub Description (copy-paste)**: Use FR-2's #1 repo description — 1–2 sentences, keyword-rich.
  - **GitHub Topics (8–12, comma-separated)**: Curated high-search-volume topics. Suggest: `legal-tech`, `indian-law`, `ai-legal`, `accuracy-first`, `zero-hallucination`, `legal-drafting`, `citation-verification`, `indian-courts`, `react`, `fastapi`, `bilingual`, `hindi-english`, `open-source`, `forensics` (pick top 12 or condense to 10).
  - **Next Manual Steps (4 items)**:
    1. Banner image: Suggest dimensions 1280×640, prompt copy using the "forensic standard guard that catches what prosecution misses" hook, tools: Canva/Figma.
    2. Demo GIF/screenshots: Record 20–40s Hemraj flow as instructed in README screenshots section. Place files at `docs/assets/` per README relative paths.
    3. Update Live Demo badge URL in README badges row once Netlify URL is confirmed.
    4. Social share copy suggestion: Pre-drafted 1–2 paragraphs for X / Reddit / LinkedIn / dev.to, referencing Hemraj case + IS 2250:1981 guard example, ending with "Star if useful! [link]".
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-6.1: Description ≤2 sentences, ≥4 domain keywords present. Evidence: description string with keyword count.
  - `rule` TR-6.2: Topics count is 8–12. Evidence: comma-separated list length.
  - `rule` TR-6.3: "Next Manual Steps" section has ≥3 concrete, actionable items. Evidence: manual count.
- **Notes**: This is a summary/documentation task. The user copies these strings into GitHub Settings manually.

## Task 7: Independent Self-Review Checklist (Pre-Submission Gate)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3, 4, 5, 6 all completed
- **Description**:
  - Read all 4 committed files (README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, .github/ISSUE_TEMPLATE/*.yml) from disk as final verification.
  - Cross-check every AC rule + rubric in spec.md:
    - AC-1 → Task 2 evidence
    - AC-2 → Task 2 evidence
    - AC-3 → Task 1 evidence
    - AC-4 → Task 3 evidence (EXACT 4-rule match — critical)
    - AC-5 → Task 4 evidence
    - AC-6 → Task 5 evidence
    - AC-7 → Task 6 evidence
    - AC-8 → Task 2 rubric TR-2.8
    - AC-9 → Task 2 rubric TR-2.9
    - AC-10 → Task 2 TR-2.6, TR-2.7, TR-2.4, creator quote
  - Confirm no application source files were touched.
  - Run `GetDiagnostics` or applicable linters on changed files (Markdown has no linter by default — skip if unavailable, otherwise run).
- **Acceptance Criteria Addressed**: All ACs via final cross-check
- **Test Requirements**:
  - `rule` TR-7.1: 0 application source files in the diff set (diff must touch only docs/.github). Evidence: `git diff --name-only` output listing.
  - `rule` TR-7.2: Every AC (10 total) has at least 1 matching TR evidence line from tasks 1–6 in this file's completion log. Evidence: manual checklist — 10/10 ACs checked off.
  - `rubric` TR-7.3: Dimension = Overall coherence between title/tagline suggestions and README hero; scale 1–5; anchors: 1=disjoint, 3=consistent, 5=#1 pick applied as H1 AND variants clearly labeled above it; threshold >= 4; evidence = README top ~60 lines.
- **Notes**: This is the final task before presenting the complete result to the user.
