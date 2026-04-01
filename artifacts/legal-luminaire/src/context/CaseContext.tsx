import { createContext, useContext, useMemo, useState } from "react";
import {
  CaseRecord,
  defaultCase,
  loadCases,
  loadSelectedCaseId,
  saveCases,
  saveSelectedCaseId,
} from "@/lib/case-store";

type CaseContextType = {
  cases: CaseRecord[];
  selectedCaseId: string;
  selectedCase: CaseRecord;
  setSelectedCaseId: (id: string) => void;
  addCase: (record: CaseRecord) => void;
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

  return (
    <CaseContext.Provider value={{ cases, selectedCaseId, selectedCase, setSelectedCaseId, addCase }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCaseContext() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCaseContext must be used within CaseProvider");
  return ctx;
}

