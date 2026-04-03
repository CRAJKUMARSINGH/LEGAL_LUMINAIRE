import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CaseRecord,
  defaultCase,
} from "@/lib/case-store";
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

const API_BASE = "http://localhost:8000/api/v1";

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [selectedCaseId, setSelectedCaseIdState] = useState<string>("case-01");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load cases from backend
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${API_BASE}/cases`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setCases(data);
            const savedId = localStorage.getItem("legal_luminaire_selected_case_v1");
            if (savedId && data.some((c: any) => c.id === savedId)) {
               setSelectedCaseIdState(savedId);
            } else {
               setSelectedCaseIdState(data[0].id);
            }
          } else {
            // Seed default if empty
            await addCase(defaultCase);
          }
        }
      } catch (err) {
        console.error("Failed to load cases from backend:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const selectedCase = useMemo(() => {
    const found = cases.find((c) => c.id === selectedCaseId);
    if (found) return found;
    // If not found in list (e.g. metadata-only list), we'd ideally fetch detail.
    // For now, we assume the list has basic info or we fallback to default.
    return cases[0] || defaultCase;
  }, [cases, selectedCaseId]);

  const setSelectedCaseId = (id: string) => {
    setSelectedCaseIdState(id);
    localStorage.setItem("legal_luminaire_selected_case_v1", id);
  };

  const addCase = async (record: CaseRecord) => {
    try {
      const res = await fetch(`${API_BASE}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        const newCase = await res.json();
        setCases(prev => [newCase, ...prev.filter(c => c.id !== newCase.id)]);
        setSelectedCaseId(newCase.id);
        toast({ title: "Case Created", description: `Case ${newCase.id} saved to server.` });
      }
    } catch (err) {
      toast({ title: "Sync Error", description: "Failed to save case to server.", variant: "destructive" });
    }
  };

  const deleteCase = async (id: string) => {
    if (id === "case-01") return; 
    try {
      const res = await fetch(`${API_BASE}/cases/${id}`, { method: "DELETE" });
      if (res.ok) {
        const next = cases.filter((c) => c.id !== id);
        setCases(next);
        if (selectedCaseId === id && next.length > 0) setSelectedCaseId(next[0].id);
        toast({ title: "Case Deleted", description: "Removed from server." });
      }
    } catch (err) {
      toast({ title: "Delete Error", description: "Failed to delete from server.", variant: "destructive" });
    }
  };

  const duplicateCase = async (id: string) => {
    const src = cases.find((c) => c.id === id);
    if (!src) return;
    const copy: CaseRecord = {
      ...src,
      id: `case-${Date.now()}`,
      title: `${src.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    await addCase(copy);
  };

  const createFromTemplate = async (templateId: string, overrides: Partial<CaseRecord> = {}) => {
    const generated = generateCaseFromTemplate(templateId, overrides as any);
    if (!generated) return;
    const record: CaseRecord = {
      id: generated.id,
      title: generated.title,
      court: generated.court,
      caseNo: generated.caseNo,
      brief: generated.brief,
      createdAt: generated.createdAt,
      files: [],
      status: generated.status,
      charges: generated.charges,
      caseLaw: generated.caseLaw as CaseRecord["caseLaw"],
      timeline: generated.timeline as CaseRecord["timeline"],
      strategy: generated.strategy as CaseRecord["strategy"],
      standards: generated.standards as CaseRecord["standards"],
      metadata: generated.metadata,
    };
    await addCase(record);
  };

  return (
    <CaseContext.Provider value={{
      cases, selectedCaseId, selectedCase,
      setSelectedCaseId, addCase, deleteCase, duplicateCase,
      createFromTemplate, templates: CASE_TEMPLATES,
      isLoading
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


