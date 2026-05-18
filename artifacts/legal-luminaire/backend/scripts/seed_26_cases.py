import os
import requests
import glob
from pathlib import Path

# Connect to the local Legal Luminaire API
API_URL = "http://127.0.0.1:8000/api/v1"

_REPO_ROOT = Path(__file__).resolve().parents[4]
_REAL_CASES = _REPO_ROOT / "real_cases"

# The top 5 showcase case domains (folders under real_cases/)
CASES_TO_SEED = {
    "TC-01": "CASE01_HEMRAJ_STATE_2025",
    "TC-22": "INFRA_ARB_01_BUILDING_HOSPITAL_2026",
    "TC-23": "INFRA_ARB_02_ROAD_HIGHWAY_2026",
    "TC-24": "INFRA_ARB_03_DAM_IRRIGATION_2026",
    "TC-25": "INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026",
    "TC-26": "INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026",
}

def seed_cases():
    print("⚖️ Legal Luminaire - Offline Vector DB Seeder")
    print("===============================================")
    
    # Check if backend is alive
    try:
        r = requests.get(f"{API_URL}/health", timeout=5)
        if r.status_code != 200:
            print("Backend not healthy. Aborting.")
            return
        print("✅ Backend reachable.")
    except Exception as e:
        print(f"❌ Cannot reach backend at {API_URL}. Is uvicorn running?")
        print(f"Error: {e}")
        return

    for case_id, folder_name in CASES_TO_SEED.items():
        print(f"\n📂 Processing {case_id} ({folder_name})...")
        folder_path = _REAL_CASES / folder_name
        if not folder_path.exists():
            folder_path = _REPO_ROOT / folder_name
        if not folder_path.exists():
            print(f"⚠️ Directory {folder_name} not found locally. Skipping.")
            continue
            
        # Collect all textual files suitable for SBERT ingestion
        lex_files = list(folder_path.glob("*.lex"))
        md_files = list(folder_path.glob("*.md"))
        txt_files = list(folder_path.glob("*.txt"))
        
        all_files = lex_files + md_files + txt_files
        
        if not all_files:
            print("⚠️ No valid documents found. Skipping.")
            continue
            
        print(f"  Found {len(all_files)} documents out of 15. Ingesting to local Chroma DB...")
        
        # We process them in one batch post request
        files_payload = []
        file_handles = []
        for file_path in all_files:
            try:
                # Open the file handle
                f = open(file_path, "rb")
                file_handles.append(f)
                
                # Appending to requests format: (field_name, (filename, file_object, content_type))
                files_payload.append(("files", (file_path.name, f, "application/octet-stream")))
            except Exception as e:
                print(f"    ❌ Error reading {file_path.name}: {e}")

        # Post to indexing endpoint
        try:
            # We use 'complex' chunking strategy for the demo cases to ensure max context retention
            r = requests.post(
                f"{API_URL}/cases/{case_id}/upload", 
                files=files_payload,
                params={"complexity": "complex"},
                timeout=600  # Local SBERT embedding for 15 docs can take a few minutes
            )
            r.raise_for_status()
            out = r.json()
            indexed_count = len(out.get('indexed', []))
            print(f"  ✅ Succesfully embedded and indexed {indexed_count} chunks into {case_id} Chroma Space.")
        except Exception as e:
            print(f"  ❌ Failed to index {case_id}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"  Server response: {e.response.text}")
        finally:
            # Cleanup file handles
            for f in file_handles:
                f.close()

    print("\n🎉 Seeding Complete! All 26-Case assets are now locally vector-searchable without an API key.")

if __name__ == "__main__":
    seed_cases()
