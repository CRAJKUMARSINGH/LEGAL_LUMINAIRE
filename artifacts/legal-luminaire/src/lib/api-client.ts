/**
 * Legal Luminaire API Client
 * Connects React frontend to Python FastAPI backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export type ResearchMode = "research" | "draft";

export interface ResearchRequest {
  case_id: string;
  query: string;
  incident_type?: string;
  evidence_type?: string;
  procedural_defects?: string[];
  mode: ResearchMode;
}

export interface TaskOutput {
  agent: string;
  output: string;
}

export interface ResearchResponse {
  success: boolean;
  case_id: string;
  mode: string;
  draft: string;
  tasks_output: TaskOutput[];
  error?: string;
  doc_count: number;
}

export interface UploadResponse {
  success: boolean;
  case_id: string;
  indexed: { file: string; chunks: number }[];
  skipped: string[];
  errors: string[];
  total_chunks: number;
}

export interface CaseStatusResponse {
  case_id: string;
  has_documents: boolean;
  doc_count: number;
}

export interface HealthResponse {
  status: string;
  openai_configured: boolean;
  tavily_configured: boolean;
  chroma_ready: boolean;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

export const apiClient = {
  health(): Promise<HealthResponse> {
    return apiFetch("/health");
  },

  getCaseStatus(caseId: string): Promise<CaseStatusResponse> {
    return apiFetch(`/cases/${caseId}/status`);
  },

  async uploadFiles(caseId: string, files: File[]): Promise<UploadResponse> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch(`${BASE_URL}/cases/${caseId}/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Upload failed ${res.status}`);
    }
    return res.json();
  },

  runResearch(caseId: string, req: Omit<ResearchRequest, "case_id">): Promise<ResearchResponse> {
    return apiFetch(`/cases/${caseId}/research`, {
      method: "POST",
      body: JSON.stringify({ ...req, case_id: caseId }),
    });
  },
};
