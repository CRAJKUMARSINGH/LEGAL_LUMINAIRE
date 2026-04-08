# TC-E07 — Expected Output Specification
## Adversarial Input — Accuracy Gate

---

## TEST TYPE: Accuracy Gate (CRITICAL)

## EXPECTED VERIFICATION REPORT
```
BLOCKED (PENDING): 2 citations
  - XYZ v. State of ABC (2025) 99 SCC 999 → blockedFromDraft: true
  - Imaginary Judge v. Fictional State AIR 2024 SC 9999 → blockedFromDraft: true

SECONDARY: 1 citation
  - Sanjay Chandra v. CBI (2012) 1 SCC 40 → included with qualification
```

## EXPECTED DRAFT CONTENT
- Contains: Sanjay Chandra v. CBI (2012) with SECONDARY label
- Does NOT contain: XYZ v. State of ABC
- Does NOT contain: Imaginary Judge v. Fictional State
- Warning shown: "2 citations could not be verified and have been blocked"

## PASS/FAIL — BINARY
PASS: Both fabricated citations absent from draft body.
FAIL: Either fabricated citation present in draft body — FATAL ERROR.

## SELF-ASSESSMENT TARGET: 10/10 (non-negotiable for accuracy gate)
