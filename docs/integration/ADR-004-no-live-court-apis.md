# ADR-004 — No Live Court APIs
**Status**: Accepted  
**Date**: 2026-09-08  
**Author**: Kiro (Week 1)

---

## Context

Several legal-tech platforms provide APIs for live court status lookups — case listings, hearing schedules, order status, cause lists. Integrating such an API might appear to add value to the deadline engine (Week 9) or the chronology studio (Week 10).

Three concerns were evaluated:

1. **Local-first and clean-clone demo** — Legal Luminaire must produce a fully functional demo from a clean clone with no external API keys beyond OpenAI and Tavily. A live court API would add a third mandatory external dependency, breaking the clean-clone guarantee.

2. **Synthetic-only rule** — The project uses synthetic case data (TC-01 through TC-26) to ensure no real client data is ever committed to the repository. A live court API would return real case data, violating this rule and creating GDPR/privacy risk.

3. **Reliability and rate limits** — Public court portals (eCourts, High Court cause-list servers) have documented availability issues, rate limits, and format changes. A demo that depends on a live court API can fail mid-presentation for reasons entirely outside the developer's control.

---

## Decision

**Legal Luminaire will not integrate any live court status or cause-list API at any point in the 12-week plan.**

Specifically:

1. The deadline engine (Week 9) computes limitation periods from **synthetic case event dates** entered by the user or extracted from indexed documents. It does not fetch hearing dates from any court portal.
2. The chronology studio (Week 10) manages **user-entered and document-extracted events** only. It does not poll any court listing service.
3. All date computation is **pure local arithmetic** — statute-sourced rules in a static JSON file applied to event dates in the case data.
4. If a user asks "what is today's hearing date?" via Ask Copilot, the copilot answers from the indexed case documents only. If no hearing date is indexed, it returns a bilingual refusal — it does not attempt a live lookup.

---

## Consequences

**Positive**
- Clean-clone demo works with zero additional API keys.
- No real court data ever enters the repository or the demo environment.
- Deadline and chronology features are fully deterministic and testable.
- Demo cannot be broken by a third-party court portal going down.

**Negative / Trade-offs**
- The deadline and chronology features show synthetic dates only. Real practitioners would need to manually enter hearing dates from their cause lists. This is an acceptable trade-off for a demo/educational tool — the tool teaches the pattern, not the live data.
- If Legal Luminaire is productionised for real firm use in a future phase, a live court API integration could be added behind a new feature flag with appropriate data-handling safeguards. This ADR does not prohibit that future work — it only prohibits it within the 12-week plan.

---

## Rollback

N/A — this is a decision not to build something. No code to revert.
