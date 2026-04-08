# Citation Risk Reduction Plan (v1)

This note documents **the top citation-quality weak points** in Legal Luminaire and the **specific code-level fixes** to address them, in order of risk.

---

## The 5 Weak Points to Fix — In Order of Risk

### 1) The AI Can Still Invent Citations
The current verifier checks citations against uploaded documents — but if a citation isn't in your documents, the AI may generate a plausible-sounding but fake case name.

**Fix**: Add a **citation allowlist**:
- Only output citations that exist in your **case-law matrix data** or have been fetched from a **live verification API**.
- Any citation not on the allowlist is flagged **PENDING** automatically and must **never** enter a draft as **VERIFIED**.

### 2) Para/Page Numbers Are Not Verified
If a draft says “as held in para 14”, it is dangerous if the para number is hallucinated.

**Fix**:
- Add a `para` field to every entry in your case-law matrix.
- Prohibit the drafter from citing specific paragraphs unless `para` is populated.

### 3) Proposition Language Is Not Locked
The `useForDefence` field is the controlled proposition, but the drafter may paraphrase it loosely and change meaning.

**Fix**:
- In the drafter system prompt: quote the `useForDefence` proposition **verbatim** when using a case-law matrix entry; do not paraphrase.

### 4) No Citation Format Enforcement
Indian courts expect a stable citation format. If the AI outputs partial citations, it becomes unacceptable in court.

**Fix**:
- Add `reporter`, `volume`, `page`, `year` fields (where available) and build a **formatter utility** that assembles the citation string.
- Use this formatted citation everywhere (matrix UI + drafts + tooltips).

### 5) Secondary Citations Are Treated as Near-Verified
SECONDARY is still unverified for court use; it should be treated as risky.

**Fix**:
- If a generated draft contains **SECONDARY** citations, show a warning and require explicit acknowledgement before download/print.
- If a draft contains **PENDING** citations, block download until the user verifies them.

---

## What to Add to the Codebase — Specific Steps

### Step A — Extend the Citation Data Structure
In the case-law matrix structure, add:

- `reporter`: `"SCC" | "SCR" | "GLR" | "SCC OnLine Bom" | ...`
- `volume`: `"4"`
- `page`: `"317"`
- `year`: `"2014"`
- `para`: `"18-22"` (leave blank if unverified)
- `verifiedBy`: `"case-file" | "indiankanoon" | "manual"`

### Step B — Build a Citation Formatter Utility
Create `src/lib/citation-formatter.ts`:

**Input**: a case-law matrix entry  
**Output**: `Party v. Party (Year) Volume Reporter Page`

Example:
- `Sushil Sharma v. State (NCT of Delhi) (2014) 4 SCC 317`

### Step C — Lock the Drafter Prompt (highest impact)
Add to the drafter system prompt:
- Only cite from the **provided allowlist** / verified list.
- Use proposition text **verbatim**.
- If `para` is empty, **do not mention** a specific paragraph.

### Step D — Indian Kanoon API (Free)
When adding a new case to the matrix, validate it exists via:
- `https://api.indiankanoon.org/search/?formInput=CASE_NAME&pagenum=0`

Mark VERIFIED only after API confirms it (store evidence in `verifiedBy` + `sourceUrl`).

### Step E — PENDING Citation Block
Before download/print:
- scan the generated text for **PENDING** citations
- block the output with: “This draft contains X unverified citations. Verify them before filing.”

---

## One Thing You Can Do Today — Without Code
In the case-law matrix, for every SECONDARY/PENDING entry, fill the `action` field with the exact operational step:
- “Download from Indian Kanoon — search: [exact case name]”

This becomes a daily verification tracker.

