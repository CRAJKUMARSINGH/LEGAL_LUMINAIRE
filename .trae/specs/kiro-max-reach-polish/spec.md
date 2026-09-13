# Kiro Max-Reach Polish - Product Requirements Document

## Overview
- **Summary**: Ultimate README overhaul + comprehensive repository polish for the Legal Luminaire open-source project. Includes brand-new modern README, magnetic titles/taglines, CONTRIBUTING rewrite, CODE_OF_CONDUCT creation, GitHub issue template YAML conversion, and repo metadata/topics recommendations.
- **Purpose**: Turn Legal Luminaire into a highly attractive, professional, instantly understandable open-source project so visitors grasp its value in <10 seconds and feel compelled to star, fork, try, share, and contribute. Maximize organic reach, stars, forks, users, and real-world adoption.
- **Target Users**: GitHub visitors discovering the repo — Indian advocates, legal tech engineers, open-source contributors, law firms evaluating tools, legal AI researchers, and dev-tooling enthusiasts.

## Goals
1. Every new visitor instantly understands the project's purpose, brilliance, and target audience in <10 seconds.
2. 90% of technical users can install + run the demo mode successfully in <2 minutes.
3. README structure follows a proven modern open-source format with all required sections.
4. Magnetic titles/taglines capture the project's unique dual-expert advantage and accuracy-first ethos.
5. All standard community health files exist (CONTRIBUTING, CODE_OF_CONDUCT, issue templates).
6. GitHub metadata recommendations (description + topics) are produced for immediate manual application.

## Non-Goals
- No changes to application source code, routing, components, or backend logic.
- No changes to existing .kiro specs, steering files, or internal accuracy rules.
- No actual screenshot/GIF creation (only clear placeholders with instructions).
- No real Pull Request push to remote (user executes the Git lifecycle manually per their workflow preference).
- No API key or credential changes.
- No modification of the LICENSE file.

## Background & Context
Legal Luminaire is an accuracy-first AI legal research + drafting platform for Indian courts, built by Rajkumar Singh Chauhan — a Senior Counsel AND Civil Engineer with 30+ years in Indian litigation. Unique differentiators include:
- 5-tier citation verification (COURT_SAFE → VERIFIED → SECONDARY → PENDING → FATAL_ERROR) with automatic citation blocking.
- Fact-Fit Gate (0–100 scoring, auto-reject below 30).
- Forensic engineering standards guard (catches IS 1199:2018 vs IS 2250:1981 misapplication) that comes from real courtroom cross-examination scars.
- 55+ routes across 4 groups: Case Setup, Research, Drafting, Review.
- 26 pre-loaded synthetic demo cases (criminal, civil, arbitration, infrastructure).
- Full bilingual (Hindi + English) UI and output.
- Local-first demo mode — runs with zero API keys.
- 343/343 passing Vitest tests, production CI lock on Netlify, pnpm monorepo.

Current weaknesses:
- README exists but lacks modern scannable emoji structure, explicit screenshots/demo section, roadmap, star/share CTA, or dedicated "How to Use" with step-by-step workflows.
- No CODE_OF_CONDUCT.md present.
- CONTRIBUTING.md is brief and accuracy-focused but could be warmer, more welcoming, and more modern.
- Issue templates use old .md format instead of modern GitHub .yml (form-based) format.
- No explicit visual placeholders (banner image, demo GIF, screenshots) even though the app is highly visual.
- Badges exist but could be expanded (build status, test coverage, stars, version, last commit, contributors).
- No dedicated tagline/titles brainstorm section — current one-liner is good but could have multiple variants for A/B use.

## Functional Requirements
- **FR-1 (README)**: A rewritten `README.md` at repo root containing exactly these sections in order:
  1. Hero (emoji + project name + ultra-compelling one-line tagline)
  2. Shields.io badges row
  3. ✨ What makes this brilliant? (3–5 sentence hook/value/wow paragraph)
  4. 🚀 Key Features (emoji bullet list, benefit-focused, ~10–15 bullets)
  5. 📸 Demo / Screenshots (relative image paths + placeholders + GIF/video suggestion)
  6. ⚡ Quick Start (under 90 seconds, numbered, copy-paste friendly)
  7. 📖 How to Use (practical step-by-step with real code snippets / CLI examples / common workflows)
  8. 🔧 Configuration / Options (env vars, flags, config files)
  9. 🛠 Tech Stack (clean list or table)
  10. 🗺 Roadmap / Planned Features (realistic next-items based on existing feature flags and W13 lock docs)
  11. 🤝 How to Contribute (welcome + link to CONTRIBUTING.md)
  12. 📜 License
  13. ❤️ Shout-outs / Thanks / Inspirations
  14. ⭐ Star-the-repo CTA
- **FR-2 (Titles/Taglines)**: A numbered deliverable set (placed at top of README in a "✨ Magnetic Titles" section, clearly marked as suggestions) consisting of:
  - 1 Suggested Hero Title (emoji + name + one-sentence killer tagline)
  - 1 GitHub Repo Description (1–2 sentences, SEO-optimized)
  - 5–8 Alternative Taglines / One-Liners (mix benefit/curiosity/exciting/concise, each <15 words)
  - 1 Subtitle / Elevator Pitch (2–4 sentences)
  - Explanation of why each fits, plus a #1 top-pick recommendation
- **FR-3 (CONTRIBUTING.md)**: An improved `CONTRIBUTING.md` at repo root that is:
  - Friendly and welcoming in tone.
  - Contains sections: Welcome, Code of Conduct link, Ground Rules (accuracy + safety — preserve existing 4 rules verbatim), Dev Quickstart (frontend + backend, Windows/macOS/Linux), PR Guidelines, Adding Demo Assets, Bug Reports, Feature Requests, Community.
- **FR-4 (CODE_OF_CONDUCT.md)**: A new `CODE_OF_CONDUCT.md` at repo root using Contributor Covenant v2.1 standard, with enforcement contact email pointing to a reasonable placeholder (e.g., the GitHub issue tracker as initial channel).
- **FR-5 (Issue Templates YAML)**: `.github/ISSUE_TEMPLATE/bug_report.yml` and `.github/ISSUE_TEMPLATE/feature_request.yml` (modern GitHub YAML form-based templates). Existing .md templates may be kept alongside or replaced; deliverables require the .yml files exist.
  - bug_report.yml: title prefix, labels, body with fields: Summary, Steps-to-reproduce (textarea), Expected (textarea), Actual (textarea), Environment (OS / Node / Python / Browser dropdowns or inputs), Screenshots/Logs (textarea).
  - feature_request.yml: title prefix, labels, body with: Problem statement, Proposed solution, Alternatives, Accuracy/Governance impact (checkboxes for VERIFIED tiers + Fact-Fit Gate).
- **FR-6 (Repo Metadata Recommendations)**: Clearly listed in a PR-style summary document (output as part of final deliverables, not a committed file — shown to user in conversation and in the spec/tasks evidence):
  - Short keyword-rich GitHub repo description (copy-paste ready).
  - 8–12 GitHub Topics (list).
  - Next manual steps suggestions (banner image, demo GIF, social share copy).

## Non-Functional Requirements
- **NFR-1 (Readability)**: README and all docs are highly scannable: short paragraphs, bold, italics, emojis, code blocks, tables, consistent heading levels.
- **NFR-2 (Tone)**: Warm, excited, confident tone — feels like a hidden masterpiece ready to shine. Never hype beyond actual features.
- **NFR-3 (SEO)**: Natural inclusion of GitHub/Google search keywords (indian-law, ai-legal, legal-ai, accuracy-first, zero-hallucination, react, fastapi, bilingual, hindi-english, legal-drafting, citation-verification, indian-courts, advocacy, legal-tech, open-source, forensics, arbitration). No stuffing.
- **NFR-4 (First-Time User)**: Assumes first-time visitor knows zero about Indian law or the project. Defines domain terms on first use.
- **NFR-5 (Copy-Paste Friendly)**: All Quick Start commands are directly copy-pasteable on PowerShell (Windows) AND bash (macOS/Linux) where possible, or clearly labeled per platform.
- **NFR-6 (No Fabrication)**: Every feature claimed in README must trace to actual code (routes, packages, components, CI). No invented features. "Built by dual-expert" is factual — Rajkumar is both Civil Engineer + Senior Counsel.
- **NFR-7 (Linearity)**: No circular cross-references between docs files. README → CONTRIBUTING → CODE_OF_CONDUCT flow is one-way and clear.

## Constraints
- **Technical**: All new files are plain Markdown or YAML. No build step required for docs. File names and locations are fixed by GitHub convention (CONTRIBUTING.md, CODE_OF_CONDUCT.md at repo root; ISSUE_TEMPLATES under .github/ISSUE_TEMPLATE/).
- **Business**: All existing accuracy rules and governance language from the current README and CONTRIBUTING.md are preserved verbatim (no weakening of the accuracy-first stance — IS 2250:1981/IS 1199:2018 guard, 5-tier definitions, citation blocking rules).
- **Dependencies**: No new npm/Python packages. Docs-only change.

## Assumptions
- User will apply GitHub description/topics manually in the repo Settings UI (no API automation provided).
- User will create/upload actual banner image, screenshots, and demo GIF separately; README uses placeholders with clear paths (e.g., `docs/assets/screenshot-dashboard.png`) and instructions.
- Git branch creation, commit, push, and PR creation are executed per user's explicit approval workflow. Spec Mode approval comes before implementation.
- User's existing Hemraj case pack remains untouched; README references it as before.

## Acceptance Criteria

### AC-1: README contains all 14 required sections in order
- **Type**: `rule`
- **Given**: A clean file system tree at repo root
- **When**: Parsing `README.md` heading level-2 (`##`) lines
- **Then**: The heading titles match the ordered list specified in FR-1 exactly (Hero is H1 / H2 combo; the 13 H2 sections following match)
- **Pass Condition**: `grep "^## " README.md` outputs 13 lines in exact order of FR-1 sections 3–14
- **Evidence**: Console output of heading extraction from README.md

### AC-2: README Hero section has emoji + project name + killer one-liner + badges row
- **Type**: `rule`
- **Given**: Top 40 lines of README.md
- **When**: Scanning for: (a) a leading H1 with emoji + "Legal Luminaire", (b) a bold/tagline line <30 words, (c) ≥4 shields.io badge image URLs
- **Then**: All three conditions (a, b, c) are true
- **Pass Condition**: Lines 1–40 contain H1 emoji header, tagline, and ≥4 shields.io badges
- **Evidence**: README.md lines 1–40 excerpt

### AC-3: Titles/Taglines deliverable set present and complete
- **Type**: `rule`
- **Given**: README.md top section (or clearly marked subsection)
- **When**: Counting: Hero Title suggestions (1), Repo Description (1), Alternative Taglines (≥5), Elevator Pitch (2–4 sentences), #1 top-pick reasoning
- **Then**: All counts are met and each has a 1-sentence "Why it fits" explanation
- **Pass Condition**: Manual count of all items ≥ 1+1+5+1 and top-pick reasoning paragraph present
- **Evidence**: README.md subsection with all title/tagline deliverables marked and numbered

### AC-4: CONTRIBUTING.md has all required sections and preserves existing 4 ground rules verbatim
- **Type**: `rule`
- **Given**: CONTRIBUTING.md at repo root
- **When**: Checking H2 sections AND exact-string-match against current 4 rules
- **Then**: All sections from FR-3 exist AND the 4 ground rules sentences match the current CONTRIBUTING.md word-for-word
- **Pass Condition**: Section headings present + 4-rule string diff empty
- **Evidence**: CONTRIBUTING.md heading list + 4-rule diff output

### AC-5: CODE_OF_CONDUCT.md exists and uses Contributor Covenant v2.1
- **Type**: `rule`
- **Given**: Repo root file listing
- **When**: Opening CODE_OF_CONDUCT.md and searching for "Contributor Covenant" AND "2.1" AND enforcement section
- **Then**: File exists, covenant identified, version 2.1 clear, enforcement channel stated
- **Pass Condition**: File exists + 3 string matches confirmed
- **Evidence**: File presence check + grep output

### AC-6: YAML issue templates exist with required fields
- **Type**: `rule`
- **Given**: `.github/ISSUE_TEMPLATE/` directory listing
- **When**: Parsing `bug_report.yml` and `feature_request.yml` YAML front-matter body elements
- **Then**: bug_report.yml has ≥ Summary, Steps, Expected, Actual, Environment fields; feature_request.yml has ≥ Problem, Proposed Solution, Alternatives, Accuracy/Governance fields
- **Pass Condition**: Both YAML files present with named fields validated
- **Evidence**: `ls` listing + YAML field list inspection

### AC-7: Repo metadata recommendations produced (description + 8–12 topics)
- **Type**: `rule`
- **Given**: Final implementation summary presented to user
- **When**: Listing GitHub description copy-paste string and topics list
- **Then**: Description is ≤2 sentences, keyword-rich; topics count is 8–12 comma-separated GitHub-appropriate tags
- **Pass Condition**: String length and topic count within bounds
- **Evidence**: Metadata section of final summary / task completion evidence

### AC-8: All Quick Start commands are copy-paste friendly and Windows-visible
- **Type**: `rubric`
- **Dimension**: Quick Start usability across Windows (PowerShell) + bash (macOS/Linux)
- **Scale**: 1–5
- **Anchors**: 1 = Commands are bash-only, fail on PowerShell, no labels; 3 = Commands mostly work OR are labeled by OS with one gap; 5 = Every block is clearly labeled `# Windows (PowerShell)` / `# macOS / Linux (bash)` or is cross-shell, with copy-paste-tested syntax
- **Pass Threshold**: >= 4
- **Evidence**: README.md Quick Start section blocks, with OS labels visible

### AC-9: README scannability and modern open-source feel
- **Type**: `rubric`
- **Dimension**: Scannability, emojis, short paragraphs, bold/italics usage, tables, code blocks — compared to top 100 GitHub READMEs
- **Scale**: 1–5
- **Anchors**: 1 = Walls of text, no emojis, rare formatting; 3 = Some emojis, decent formatting, one or two long unbroken paragraphs remain; 5 = Every H2 starts with emoji, paragraphs ≤3 sentences, heavy use of bold/italics/code/tables, generous whitespace
- **Pass Threshold**: >= 4
- **Evidence**: Full README.md visual scan / paragraph length counts

### AC-10: Accuracy rules governance language preserved and emphasized
- **Type**: `rubric`
- **Dimension**: Accuracy-first ethos prominence — ensuring the unique dual-expert and courtroom-scar rules are not diluted by marketing tone
- **Scale**: 1–5
- **Anchors**: 1 = Accuracy rules buried or softened; 3 = Accuracy rules present in same wording but no extra emphasis; 5 = "Non-negotiable" block present, 5-tier table retained, IS 2250/IS 1199 example highlighted in hero/purpose section, creator quote retained
- **Pass Threshold**: >= 4
- **Evidence**: README sections referencing verification tiers, standards guard, creator quote, accuracy rules

## Open Questions
- [ ] Should existing .md issue templates be deleted after .yml is created, or kept alongside? (Assumption: keep .md, add .yml alongside — safer, no breakage for links; configurable later.)
- [ ] Should the "✨ Magnetic Titles" section live permanently at the top of README, or be a PR-description-only deliverable? (Assumption: placed at README top as clearly-labeled suggestions with a #1 pick applied as the actual H1 — user can edit/remove the suggestion section easily.)
- [ ] Deploy badge URL — user hasn't confirmed actual Netlify URL. Badge will use a generic placeholder with note to update after deploy.
