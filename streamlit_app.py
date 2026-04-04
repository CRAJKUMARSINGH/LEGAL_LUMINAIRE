"""
Legal Luminaire — Streamlit Client
Deploy to Streamlit Community Cloud: https://share.streamlit.io/
Main file: streamlit_app.py
"""
import os
import requests
import streamlit as st
from pathlib import Path

DEFAULT_API = os.environ.get("LEGAL_LUMINAIRE_API", "http://127.0.0.1:8000/api/v1")

st.set_page_config(
    page_title="Legal Luminaire",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Sidebar ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://img.shields.io/badge/Legal%20Luminaire-Accuracy%20First-blue?style=for-the-badge", use_container_width=True)
    st.markdown("### ⚖️ Legal Luminaire")
    st.caption("Accuracy-first AI legal research + drafting for Indian courts.")

    st.divider()
    st.subheader("🔌 Backend Connection")
    api_base = st.text_input("API base URL", value=DEFAULT_API, help="FastAPI backend URL. Leave default for local use.")
    case_id = st.text_input("Case ID", value="case01", help="e.g. case01, case02")

    if st.button("🩺 Check backend health"):
        try:
            r = requests.get(f"{api_base}/health", timeout=10)
            r.raise_for_status()
            st.success("Backend reachable")
            st.json(r.json())
        except Exception as e:
            st.warning(f"Backend not reachable: {e}")
            st.info("Frontend-only demo mode is still available below.")

    st.divider()
    st.markdown("**Quick links**")
    st.markdown("- [GitHub Repo](https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE)")
    st.markdown("- [User Manual](docs/USER_MANUAL.md)")
    st.markdown("- [Video Script](docs/VIDEO_MANUAL_SCRIPT.md)")
    st.markdown("- [Accuracy Rules](docs/accuracy-governance/ACCURACY_RULES.md)")

# ── Main tabs ─────────────────────────────────────────────────────────────────
tab_manual, tab_upload, tab_research, tab_demo = st.tabs([
    "📖 User Manual", "📂 Upload & Index", "🤖 Research / Draft", "🎬 Demo Case"
])

# ── Tab 1: User Manual ────────────────────────────────────────────────────────
with tab_manual:
    st.title("⚖️ Legal Luminaire")
    st.markdown("""
**Accuracy-first AI legal research + drafting for Indian courts.**

Runs locally on your PC. No subscription. No hallucinations.

---

### Why Legal Luminaire?

**Surgical precision.** The app catches what the prosecution misses.

Real example from the included Hemraj case pack:
The prosecution's FSL report applied **IS 1199:2018** (fresh concrete standard) to hardened masonry mortar.
The correct standard is **IS 2250:1981**. Legal Luminaire flags this automatically — instantly destroying
the scientific basis of the prosecution's case.

---

### Verification Tiers

| Tier | Meaning | Draft Output |
|------|---------|-------------|
| `COURT_SAFE` | Certified copy + para number confirmed | ✅ Allowed |
| `VERIFIED` | Confirmed on official source | ✅ Allowed |
| `SECONDARY` | Credible secondary source | ⚠️ With qualification |
| `PENDING` | Unverified | ❌ Blocked |
| `FATAL_ERROR` | Factually mismatched | ❌ Blocked |

---

### Quick Start (Local PC)

```powershell
# Frontend
cd artifacts\\legal-luminaire
npm install --ignore-scripts
npm run dev
# Open http://localhost:5173/

# Backend (optional — enables RAG + AI drafting)
cd artifacts\\legal-luminaire\\backend
python -m venv .venv
.\\.venv\\Scripts\\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

---

### Deploy Options

- **Streamlit Cloud** — deploy `streamlit_app.py` (this file) — free, no credit card
- **Netlify** — root `netlify.toml` pre-configured — frontend-only static demo
- **Vercel** — root `vercel.json` pre-configured — frontend-only static demo
- **Docker** — `docker compose up --build` — full stack local

---

### Accuracy Rules (non-negotiable)

- Every citation: full case name + citation + court + date + verified URL + para number
- Holdings: verbatim quotes only — paraphrasing is forbidden
- IS 1199:2018 → fresh concrete only. IS 2250:1981 → masonry mortar (correct)
- PENDING citations are blocked from all draft output
- Fact-Fit Gate score < 30 → citation rejected

---

### 📺 Video Guide

See `docs/VIDEO_MANUAL_SCRIPT.md` for a record-ready 8-minute demo script.
Key moment: Scene 4 — the IS 1199:2018 vs IS 2250:1981 surgical strike.
""")

    # Embed video manual script if available
    manual_path = Path("docs/VIDEO_MANUAL_SCRIPT.md")
    if manual_path.exists():
        with st.expander("📺 View full video script"):
            st.markdown(manual_path.read_text(encoding="utf-8"))

# ── Tab 2: Upload & Index ─────────────────────────────────────────────────────
with tab_upload:
    st.header("📂 Upload Documents (RAG Indexing)")
    st.caption("Upload case documents to index them into the case's local vector database.")

    uploads = st.file_uploader(
        "Upload PDFs, MD, DOCX, images",
        accept_multiple_files=True,
        type=["pdf", "md", "txt", "lex", "doc", "docx", "jpg", "jpeg", "png"],
    )

    if st.button("Upload & Index", disabled=not uploads, type="primary"):
        try:
            files = [
                ("files", (f.name, f.getvalue(), f.type or "application/octet-stream"))
                for f in uploads
            ]
            r = requests.post(f"{api_base}/cases/{case_id}/upload", files=files, timeout=300)
            r.raise_for_status()
            out = r.json()
            st.success(f"Indexed {len(out.get('indexed', []))} file(s)")
            if out.get("skipped"):
                st.info(f"Skipped (duplicates): {out['skipped']}")
            if out.get("errors"):
                st.warning(f"Errors: {out['errors']}")
            st.json(out)
        except Exception as e:
            st.error(str(e))

# ── Tab 3: Research / Draft ───────────────────────────────────────────────────
with tab_research:
    st.header("🤖 AI Research + Draft Engine")
    st.caption("Requires backend with OPENAI_API_KEY configured.")

    col1, col2 = st.columns(2)
    with col1:
        mode = st.selectbox("Mode", ["draft", "research"], index=0)
        incident_type = st.text_input(
            "Incident type",
            value="construction wall collapse forensic mortar sampling",
        )
    with col2:
        evidence_type = st.text_input(
            "Evidence type",
            value="material sampling forensic lab report chain of custody",
        )
        procedural_defects = st.text_input(
            "Procedural defects (comma-separated)",
            value="no panchnama, no chain of custody, rain/storm sampling, no sealing",
        )

    query = st.text_area(
        "Query / Instructions",
        value="Draft superior Hindi discharge application for this case.",
        height=100,
    )

    if st.button("▶ Run", type="primary"):
        with st.spinner("Running multi-agent pipeline..."):
            try:
                payload = {
                    "case_id": case_id,
                    "query": query,
                    "incident_type": incident_type,
                    "evidence_type": evidence_type,
                    "procedural_defects": [d.strip() for d in procedural_defects.split(",") if d.strip()],
                    "mode": mode,
                }
                r = requests.post(f"{api_base}/cases/{case_id}/research", json=payload, timeout=180)
                r.raise_for_status()
                out = r.json()

                meta_cols = st.columns(3)
                meta_cols[0].metric("Success", "✅" if out.get("success") else "❌")
                meta_cols[1].metric("Mode", out.get("mode", "-"))
                meta_cols[2].metric("Docs indexed", out.get("doc_count", "-"))

                if out.get("draft"):
                    st.subheader("📄 Draft Output")
                    st.text_area("Draft", value=out["draft"], height=400)
                    st.download_button(
                        "⬇ Download draft (.txt)",
                        data=out["draft"],
                        file_name=f"draft_{case_id}.txt",
                        mime="text/plain",
                    )

                if out.get("tasks_output"):
                    with st.expander("Agent task outputs"):
                        st.json(out["tasks_output"])

                if out.get("error"):
                    st.error(out["error"])

            except Exception as e:
                st.error(str(e))

# ── Tab 4: Demo Case ──────────────────────────────────────────────────────────
with tab_demo:
    st.header("🎬 Demo Case — Hemraj Vardar (Case 01)")
    st.caption("Special Sessions Case No. 1/2025, Udaipur | IPC 304A + PCA | Stadium Wall Collapse")

    st.markdown("""
**The prosecution's fatal error:**
The FSL report applied **IS 1199:2018** (scope: fresh concrete workability testing) to hardened masonry mortar
sampled from a collapsed wall. The correct standard is **IS 2250:1981** (masonry mortar) and **ASTM C1324**
(hardened mortar forensics). This foundational scientific error voids the prosecution's entire technical case.

**Defence pillars:**
1. Wrong IS standard applied → FSL report inadmissible
2. Sampling during rain/storm → contamination, chain of custody broken
3. No panchnama → procedural defect under §45 Evidence Act
4. No contractor representative present at sampling → natural justice violation
5. Haphazard, non-representative sampling → NABL protocol violation
""")

    # Show available case files
    case_dir = Path("CASE_01_HemrajG")
    if case_dir.exists():
        lex_files = sorted(case_dir.glob("*.lex"))
        pdf_files = sorted(case_dir.glob("*.pdf"))
        md_files = sorted(case_dir.glob("*.md"))

        col1, col2, col3 = st.columns(3)
        col1.metric("LEX drafts", len(lex_files))
        col2.metric("PDF outputs", len(pdf_files))
        col3.metric("Analysis docs", len(md_files))

        selected_md = st.selectbox(
            "View analysis document",
            options=[f.name for f in md_files],
            index=0 if md_files else None,
        )
        if selected_md:
            content = (case_dir / selected_md).read_text(encoding="utf-8", errors="replace")
            with st.expander(f"📄 {selected_md}", expanded=True):
                st.markdown(content[:8000] + ("\n\n*[truncated — open file for full content]*" if len(content) > 8000 else ""))
    else:
        st.info("Case 01 folder not found. Clone the full repo to access the case pack.")

    st.divider()
    st.markdown("**21 Test Cases available** — see `test-cases/README.md` for the full index.")
