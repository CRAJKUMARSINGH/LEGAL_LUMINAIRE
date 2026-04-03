import { createContext, useContext, useMemo, useState } from "react";
import {
  CaseRecord,
  defaultCase,
  loadCases,
  loadSelectedCaseId,
  saveCases,
  saveSelectedCaseId,
} from "@/lib/case-store";
import { CASE_TEMPLATES, generateCaseFromTemplate } from "@/lib/case-templates";
import type { CaseTemplate } from "@/lib/multi-case-store";

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
};

const CaseContext = createContext<CaseContextType | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CaseRecord[]>(loadCases());
  const [selectedCaseId, setSelectedCaseIdState] = useState<string>(loadSelectedCaseId());

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) || cases[0] || defaultCase,
    [cases, selectedCaseId]
  );

  const setSelectedCaseId = (id: string) => {
    setSelectedCaseIdState(id);
    saveSelectedCaseId(id);
  };

  const addCase = (record: CaseRecord) => {
    const next = [record, ...cases.filter((c) => c.id !== record.id)];
    setCases(next);
    saveCases(next);
    setSelectedCaseId(record.id);
  };

  const deleteCase = (id: string) => {
    if (id === defaultCase.id) return; // protect Case 01
    const next = cases.filter((c) => c.id !== id);
    setCases(next);
    saveCases(next);
    if (selectedCaseId === id && next.length > 0) setSelectedCaseId(next[0].id);
  };

  const duplicateCase = (id: string) => {
    const src = cases.find((c) => c.id === id);
    if (!src) return;
    const copy: CaseRecord = {
      ...src,
      id: `case-${Date.now()}`,
      title: `${src.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    addCase(copy);
  };

  const createFromTemplate = (templateId: string, overrides: Partial<CaseRecord> = {}) => {
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
    addCase(record);
  };

  return (
    <CaseContext.Provider value={{
      cases, selectedCaseId, selectedCase,
      setSelectedCaseId, addCase, deleteCase, duplicateCase,
      createFromTemplate, templates: CASE_TEMPLATES,
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

