/**
 * CaseContext — case state with localStorage-first, optional backend sync.
 * PROTECTED FILE — always falls back to localStorage, never backend-only.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CaseRecord, defaultCase, loadCases, saveCases, loadSelectedCaseId, saveSelectedCaseId } from "@/lib/case-store";
import { CASE_TEMPLATES, generateCaseFromTemplate } from "@/lib/case-templates";
import type { CaseTemplate } from "@/lib/multi-case-store";
import { useToast } from "@/hooks/use-toast";

type CaseContextType = {
  cases: CaseRecord[];
  selectedCaseId: string;
  selectedCase: CaseRecord;
  setSelectedCaseId: (id: string) => void;
  addCase: (record: CaseRecord) => void;
  deleteCase: (id: string) => void;
  duplicateCase: (id: string) => void;
  createFromTemplate: (templateId: string, overrides?: Partial<CaseRecord>) => void;
  templates: CaseTemplate[];
  isLoading: boolean;
};

const CaseContext = createContext<CaseContextType | null>(null);

// Support both live app (/api) and local backend (/api/v1)
const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export function CaseProvider({ children }: { children: React.ReactNode }) {
  // Always load from localStorage first — backend is optional enhancement
  const [cases, setCases] = useState<CaseRecord[]>(() => loadCases());
  const [selectedCaseId, setSelectedCaseIdState] = useState<string>(() => loadSelectedCaseId());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Optionally sync from backend — never blocks UI, tries live app prefix first
  useEffect(() => {
    async function syncFromBackend() {
      // Try live app prefix first (/api), then local backend (/api/v1)
      const endpoints = ["/api/cases", `${API_BASE}/cases`];
      for (const url of endpoints) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              setCases(data);
              saveCases(data);
              break; // stop on first success
            }
          }
        } catch {
          // try next endpoint
        }
      }
    }
    syncFromBackend();
  }, []);

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) ?? cases[0] ?? defaultCase,
    [cases, selectedCaseId]
  );

  const setSelectedCaseId = (id: string) => {
    setSelectedCaseIdState(id);
    saveSelectedCaseId(id);
  };

  const addCase = (record: CaseRecord) => {
    setCases((prev) => {
      const next = [record, ...prev.filter((c) => c.id !== record.id)];
      saveCases(next);
      return next;
    });
    setSelectedCaseId(record.id);
    // Fire-and-forget backend sync
    fetch(`${API_BASE}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    }).catch(() => {/* backend optional */});
  };

  const deleteCase = (id: string) => {
    if (id === "case-01") return;
    setCases((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCases(next);
      if (selectedCaseId === id && next.length > 0) setSelectedCaseId(next[0].id);
      return next;
    });
    fetch(`${API_BASE}/cases/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const duplicateCase = (id: string) => {
    const src = cases.find((c) => c.id === id);
    if (!src) return;
    addCase({ ...src, id: `case-${Date.now()}`, title: `${src.title} (Copy)`, createdAt: new Date().toISOString() });
  };

  const createFromTemplate = (templateId: string, overrides: Partial<CaseRecord> = {}) => {
    const generated = generateCaseFromTemplate(templateId, overrides as any);
    if (!generated) return;
    addCase({
      id: generated.id, title: generated.title, court: generated.court,
      caseNo: generated.caseNo, brief: generated.brief, createdAt: generated.createdAt,
      files: [], status: generated.status, charges: generated.charges,
      caseLaw: generated.caseLaw as CaseRecord["caseLaw"],
      timeline: generated.timeline as CaseRecord["timeline"],
      strategy: generated.strategy as CaseRecord["strategy"],
      standards: generated.standards as CaseRecord["standards"],
      metadata: generated.metadata,
    });
  };

  return (
    <CaseContext.Provider value={{
      cases, selectedCaseId, selectedCase,
      setSelectedCaseId, addCase, deleteCase, duplicateCase,
      createFromTemplate, templates: CASE_TEMPLATES, isLoading,
    }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCaseContext() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCaseContext must be used within CaseProvider");
  return ctx;
}
