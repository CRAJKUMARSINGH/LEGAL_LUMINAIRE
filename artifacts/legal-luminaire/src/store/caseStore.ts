/**
 * Zustand Store for Case Management
 * Replaces prop drilling with centralized state management
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CaseDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'image';
  size: number;
  uploadTime: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  chunks?: number;
  error?: string;
}

export interface Case {
  id: string;
  name: string;
  description?: string;
  documents: CaseDocument[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived';
  metadata: {
    documentCount: number;
    totalChunks: number;
    lastIngestion?: Date;
  };
}

export interface SearchState {
  query: string;
  filters: {
    documentTypes: string[];
    dateRange?: [Date, Date];
    status: string[];
  };
  results: any[];
  isLoading: boolean;
  totalCount: number;
}

export interface DraftState {
  currentDraft: {
    id?: string;
    content: string;
    type: 'bail' | 'discharge' | 'writ' | 'other';
    status: 'drafting' | 'completed' | 'error';
    progress: number;
    citations: any[];
  } | null;
  versions: Array<{
    id: string;
    content: string;
    timestamp: Date;
    changes: string;
  }>;
}

interface CaseStore {
  // State
  cases: Case[];
  activeCaseId: string | null;
  search: SearchState;
  draft: DraftState;
  
  // Computed
  activeCase: Case | null;
  
  // Actions
  setActiveCase: (caseId: string | null) => void;
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
  
  // Document actions
  addDocument: (caseId: string, document: Omit<CaseDocument, 'id' | 'uploadTime'>) => void;
  updateDocument: (caseId: string, docId: string, updates: Partial<CaseDocument>) => void;
  removeDocument: (caseId: string, docId: string) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<SearchState['filters']>) => void;
  setSearchResults: (results: any[], totalCount: number) => void;
  setLoading: (loading: boolean) => void;
  clearSearch: () => void;
  
  // Draft actions
  setCurrentDraft: (draft: DraftState['currentDraft']) => void;
  updateDraftProgress: (progress: number) => void;
  addDraftVersion: (content: string, changes: string) => void;
  clearDraft: () => void;
}

const initialState: Omit<CaseStore, 'activeCase' | 'setActiveCase' | 'addCase' | 'updateCase' | 'deleteCase' | 'addDocument' | 'updateDocument' | 'removeDocument' | 'setSearchQuery' | 'setSearchFilters' | 'setSearchResults' | 'setLoading' | 'clearSearch' | 'setCurrentDraft' | 'updateDraftProgress' | 'addDraftVersion' | 'clearDraft'> = {
  cases: [],
  activeCaseId: null,
  search: {
    query: '',
    filters: {
      documentTypes: [],
      status: [],
    },
    results: [],
    isLoading: false,
    totalCount: 0,
  },
  draft: {
    currentDraft: null,
    versions: [],
  },
};

export const useCaseStore = create<CaseStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Computed getter
      get activeCase() {
        const { cases, activeCaseId } = get();
        return cases.find(c => c.id === activeCaseId) || null;
      },
      
      // Case actions
      setActiveCase: (caseId) => set({ activeCaseId: caseId }),
      
      addCase: (caseData) => {
        const id = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newCase: Case = {
          ...caseData,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          cases: [...state.cases, newCase],
          activeCaseId: id,
        }));
        
        return id;
      },
      
      updateCase: (caseId, updates) => set((state) => ({
        cases: state.cases.map(c => 
          c.id === caseId 
            ? { ...c, ...updates, updatedAt: new Date() }
            : c
        ),
      })),
      
      deleteCase: (caseId) => set((state) => ({
        cases: state.cases.filter(c => c.id !== caseId),
        activeCaseId: state.activeCaseId === caseId ? null : state.activeCaseId,
      })),
      
      // Document actions
      addDocument: (caseId, document) => {
        const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newDocument: CaseDocument = {
          ...document,
          id: docId,
          uploadTime: new Date(),
        };
        
        set((state) => ({
          cases: state.cases.map(c => 
            c.id === caseId
              ? {
                  ...c,
                  documents: [...c.documents, newDocument],
                  metadata: {
                    ...c.metadata,
                    documentCount: c.metadata.documentCount + 1,
                  },
                  updatedAt: new Date(),
                }
              : c
          ),
        }));
      },
      
      updateDocument: (caseId, docId, updates) => set((state) => ({
        cases: state.cases.map(c => 
          c.id === caseId
            ? {
                ...c,
                documents: c.documents.map(d =>
                  d.id === docId ? { ...d, ...updates } : d
                ),
                updatedAt: new Date(),
              }
            : c
        ),
      })),
      
      removeDocument: (caseId, docId) => set((state) => ({
        cases: state.cases.map(c => 
          c.id === caseId
            ? {
                ...c,
                documents: c.documents.filter(d => d.id !== docId),
                metadata: {
                  ...c.metadata,
                  documentCount: Math.max(0, c.metadata.documentCount - 1),
                },
                updatedAt: new Date(),
              }
            : c
        ),
      })),
      
      // Search actions
      setSearchQuery: (query) => set((state) => ({
        search: { ...state.search, query },
      })),
      
      setSearchFilters: (filters) => set((state) => ({
        search: {
          ...state.search,
          filters: { ...state.search.filters, ...filters },
        },
      })),
      
      setSearchResults: (results, totalCount) => set((state) => ({
        search: { ...state.search, results, totalCount },
      })),
      
      setLoading: (loading) => set((state) => ({
        search: { ...state.search, isLoading: loading },
      })),
      
      clearSearch: () => set((state) => ({
        search: {
          ...initialState.search,
          filters: state.search.filters, // Preserve filters
        },
      })),
      
      // Draft actions
      setCurrentDraft: (draft) => set((state) => ({
        draft: { ...state.draft, currentDraft: draft },
      })),
      
      updateDraftProgress: (progress) => set((state) => ({
        draft: {
          ...state.draft,
          currentDraft: state.draft.currentDraft
            ? { ...state.draft.currentDraft, progress }
            : null,
        },
      })),
      
      addDraftVersion: (content, changes) => {
        const versionId = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newVersion = {
          id: versionId,
          content,
          timestamp: new Date(),
          changes,
        };
        
        set((state) => ({
          draft: {
            ...state.draft,
            versions: [...state.draft.versions, newVersion],
          },
        }));
      },
      
      clearDraft: () => set((state) => ({
        draft: { ...initialState.draft },
      })),
    }),
    {
      name: 'case-store',
    }
  )
);

// Selectors for optimized re-renders
export const useActiveCase = () => useCaseStore((state) => state.activeCase);
export const useCases = () => useCaseStore((state) => state.cases);
export const useSearch = () => useCaseStore((state) => state.search);
export const useDraft = () => useCaseStore((state) => state.draft);
export const useCaseDocuments = (caseId: string) => 
  useCaseStore((state) => state.cases.find(c => c.id === caseId)?.documents || []);
