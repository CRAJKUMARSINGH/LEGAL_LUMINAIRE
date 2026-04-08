---
test_id: TC-E06
title: Unsupported Document Format
category: edge
priority: P2
status: DEFINED
---
# TC-E06 — Unsupported Document Style

> [SYNTHETIC EDGE CASE — fictional data]

## Purpose
Validate format validation rejects unsupported file types gracefully.

## Input
Upload attempt with: .xlsx file, .mp4 file, .exe file

## Expected Behaviour
- App rejects unsupported formats
- Clear error: "Unsupported file type — accepted: PDF, DOCX, TXT"
- No crash
- No partial processing of binary files

## Pass Criteria
| # | Criterion | Pass Condition |
|---|-----------|----------------|
| 1 | Rejection message | Clear error shown |
| 2 | No crash | App continues |
| 3 | No binary processing | File not parsed |

## Risk Addressed
File upload security; format validation
