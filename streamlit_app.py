import os
import requests
import streamlit as st


DEFAULT_API = os.environ.get("LEGAL_LUMINAIRE_API", "http://127.0.0.1:8000/api/v1")


st.set_page_config(page_title="Legal Luminaire (Local)", layout="wide")
st.title("Legal Luminaire — Local Browser App")
st.caption("Runs on your PC. For full features, start the FastAPI backend.")

api_base = st.text_input("Backend API base URL", value=DEFAULT_API)
case_id = st.text_input("Case ID", value="case01")


def api_get(path: str):
  r = requests.get(f"{api_base}{path}", timeout=20)
  r.raise_for_status()
  return r.json()


def api_post_json(path: str, payload: dict):
  r = requests.post(f"{api_base}{path}", json=payload, timeout=120)
  r.raise_for_status()
  return r.json()


def api_post_files(path: str, files):
  r = requests.post(f"{api_base}{path}", files=files, timeout=300)
  r.raise_for_status()
  return r.json()


with st.sidebar:
  st.subheader("Health")
  if st.button("Check backend"):
    try:
      st.json(api_get("/health"))
    except Exception as e:
      st.error(f"Backend not reachable: {e}")


st.header("1) Upload documents (RAG indexing)")
uploads = st.file_uploader(
  "Upload PDFs/MD/DOCX/images",
  accept_multiple_files=True,
  type=["pdf", "md", "txt", "lex", "doc", "docx", "jpg", "jpeg", "png"],
)

if st.button("Upload & index to case", disabled=not uploads):
  try:
    files = [("files", (f.name, f.getvalue(), f.type or "application/octet-stream")) for f in uploads]
    out = api_post_files(f"/cases/{case_id}/upload", files=files)
    st.success("Indexed")
    st.json(out)
  except Exception as e:
    st.error(str(e))


st.header("2) Research / Draft")
mode = st.selectbox("Mode", ["research", "draft"], index=0)
query = st.text_area("Query", value="Draft superior Hindi discharge application for this case.")

incident_type = st.text_input("Incident type", value="construction wall collapse forensic mortar sampling")
evidence_type = st.text_input("Evidence type", value="material sampling forensic lab report chain of custody")
procedural_defects = st.text_input(
  "Procedural defects (comma-separated)",
  value="no panchnama, no chain of custody, no contractor representative, rain/storm sampling, no sealing",
)

if st.button("Run"):
  try:
    payload = {
      "case_id": case_id,
      "query": query,
      "incident_type": incident_type,
      "evidence_type": evidence_type,
      "procedural_defects": [d.strip() for d in procedural_defects.split(",") if d.strip()],
      "mode": mode,
    }
    out = api_post_json(f"/cases/{case_id}/research", payload=payload)
    st.json({k: out.get(k) for k in ["success", "case_id", "mode", "doc_count", "error"]})
    st.subheader("Draft / Output")
    st.text_area("Output", value=out.get("draft", ""), height=380)
    st.subheader("Agent outputs")
    st.json(out.get("tasks_output", []))
  except Exception as e:
    st.error(str(e))

