
## What’s already strong

- The repo already presents a differentiated promise: ingest case docs, build timelines and cross-reference matrices, score precedents with a Fact-Fit Gate, block unverified citations, and generate court-ready documents in Hindi and English. That is a real wedge, not generic AI varnish. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)
- Your marketing/docs are also smarter than average: you already mapped demo stories, personas, use-case cards, and a “Marketing Demo Mode” concept that explicitly targets advocates, law firm partners, investors, and reviewers. That means the growth engine is already sketched—you just need to productize it. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)
- The 21-case breadth is a major asset. Most legal AI products show one toy example; you already have a showcase portfolio across criminal, civil, writ, consumer, commercial, and family matters. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)

## The real blockers

If I’m being blunt, your biggest problems are **not capability gaps**. They are **activation gaps**. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

- The audit says the backend can fail to boot because of an import-time issue, which is a total-outage class problem. If the backend doesn’t reliably start, the product story collapses before the user ever feels the value. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)
- The audit and manual together show onboarding friction around API keys and local setup. That means trial users can’t get to “aha” fast enough, which is deadly for adoption. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)
- Your own modernization plan identifies the UX issues: 40+ nav items, no onboarding flow, blank empty states, weak loading states, no recent-cases panel, no test-case browser, and no dedicated demo path. That is exactly where user grab is leaking. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)
- Your marketing docs explicitly define a “Try Demo” flow with no API key, 21 case cards, demo banners, verification panels, PDF download, and a CTA into real-case mode—so the winning growth funnel is already known, just not fully shipped. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

## Artemis-level priority order

### Phase 1: Win the first 5 minutes

This is the highest ROI sprint.

1. **Make demo mode the default first experience.**  
   On first load, don’t ask users to configure anything. Give them one giant CTA: **Try Demo**. Load the most polished case immediately, ideally TC-01 forensic defence, because your own showcase map says it’s the signature story. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

2. **Fix backend stability before adding net-new features.**  
   Any import crash, mutable-default bug, or SSRF exposure is more damaging in legal tech than in ordinary SaaS because trust is the product. Reliability work here is not “backend hygiene”; it is brand infrastructure. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)

3. **Turn the home page into a mission-control dashboard.**  
   Replace link soup with 3 paths: **Start Real Case**, **Try Demo**, **Open Recent Case**. Your modernization plan already calls for recent cases, task-oriented cards, and grouped navigation—ship that before any fancy AI flourish. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

4. **Kill blank states.**  
   Every empty page should explain what happens here, why it matters, and what the next click is. In legal workflows, uncertainty feels like risk. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

5. **Add visible progress and evidence.**  
   When drafting or researching, show step progress like: ingesting → extracting facts → matching precedents → verifying citations → building draft. Users trust AI more when they can see the chain of work. Your docs already call for skeleton loaders and stronger audit-trail linking. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

### Phase 2: Convert “interesting” into “indispensable”

6. **Build the guided legal workflow.**  
   Intake → timeline → contradictions → precedent fit → draft → verification report → pre-filing checklist. This should feel like a single conveyor belt, not separate pages. Your roadmap already points in this direction. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

7. **Make the verification engine your hero UI, not a hidden subsystem.**  
   Show why a citation is VERIFIED, SECONDARY, PENDING, or blocked. Your marketing spec even calls for a real-time accuracy showcase panel and “Why was this citation blocked?” tooltip. That’s one of your best differentiators. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

8. **Ship the 21-case browser as a product feature.**  
   Not just docs. Actual card-based browsing with filters like Criminal / Civil / Writ / Consumer / Commercial. That becomes both onboarding and sales collateral. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

9. **Polish output presentation hard.**  
   Legal users judge quality by visual seriousness. Add print CSS, court-ready typography, badges, watermarking in demo mode, download-ready PDFs, and better formatting around verification reports and checklists. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

10. **Standardize setup and reduce cognitive overhead.**  
   Your repo signals monorepo/workspace complexity, while the user manual focuses on local frontend/backend setup. Tighten the setup story so contributors and evaluators see one crisp path, one demo path, and one production path. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/package.json)

## The features that will make users say “damn, this is useful”

These are the ones I’d bet on for actual user pull:

- **Contradiction Finder**: a dedicated screen that surfaces prosecution inconsistencies, missing chain-of-custody links, timeline conflicts, and wrong standards application. This is already implicit in your Hemraj positioning—make it explicit as a feature card and first-click action. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)
- **Case Strength Snapshot**: one-page summary showing risk areas, strongest defence points, blocked citations, and draft readiness. Law-firm partners love summary intelligence. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)
- **Why-this-precedent panel**: expose the Fact-Fit Gate visually, with score, fit reason, factual alignment, and para references. That makes your RAG feel accountable instead of magical. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)
- **Demo-to-real handoff**: after a user explores a demo case, offer “Start with your own case → upload FIR / charge-sheet / FSL report.” Your marketing task spec literally defines this CTA. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)
- **Recents + templates by case type**: criminal defence advocates should feel the product “understands their practice” the moment they open it. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)

## How to improve “user grab”

Your acquisition story should be: **show value before asking for effort**. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

### The best funnel for this product

**Ad / post / outreach → Try Demo → Pick case type → See contradiction / verified output → Download watermarked sample → Start real case**

That funnel is already basically described in your marketing spec. Make the product mirror the spec exactly. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

### Messaging I would sharpen

Your current copy is powerful, but a bit too absolute in places. “No hallucinations” and “That’s not a feature. That’s a weapon.” are memorable, but for law firms and serious practitioners, absolute claims can backfire unless instrumented and auditable. Even your marketing docs say some performance claims are still assumptions, not measured benchmarks. I’d shift the tone from swagger to **defensible trust**. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/README.md)

A stronger positioning line would be something like:

**“Verification-gated AI drafting for Indian advocates.”**

That lands cleaner than “no hallucinations,” while still preserving your core advantage around blocked PENDING citations and verified outputs. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)

### Three growth assets to ship immediately

- **A 90-second demo video** using the forensic defence walkthrough. You already have the showcase script structure. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)
- **Use-case landing pages** for Criminal Defence, Bail, Writs, and Consumer/Commercial—your brochure/use-case cards are already written. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_SHOWCASE_MAP.md)
- **A free “Case Readiness Scan” demo CTA** that drops users into synthetic case exploration before they ever touch setup. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

## What I’d put in the next sprint board

If this were my repo, these would be the first 10 issues:

1. Fix backend boot failure. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)  
2. Add default **Try Demo** CTA on Home. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)  
3. Build 21-card demo case selector with filters. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)  
4. Add persistent demo banner and watermarking. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)  
5. Group nav into Setup / Research / Draft / Review. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
6. Add empty-state CTAs everywhere. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
7. Add skeleton loaders and visible draft-generation progress. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
8. Link verification report directly from every generated draft. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
9. Add recent cases + template shortcuts on Home. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/MODERNIZATION_PLAN.md)  
10. Patch SSRF risk, mutable defaults, and dependency pinning. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/AUDIT-REPORT-v1.0.md)  

## My strongest recommendation

If you only do **one** thing, do this:

**Ship a ridiculously polished no-key demo path that shows one jaw-dropping legal win in under 60 seconds.**

Because right now the repo already proves you know the domain. What you need is a product journey that lets users **feel** that competence instantly. The marketing docs already point to the exact vehicle: Demo Mode, 21 case cards, verification visibility, downloadable sample output, then a handoff into real-case intake. That is your orbit-insertion burn. [Source](https://raw.githubusercontent.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE/main/docs/marketing/MARKETING_TASK_SPEC.md)

