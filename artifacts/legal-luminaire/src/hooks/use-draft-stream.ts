import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export type StreamStage = "researcher" | "verifier" | "drafter" | "streaming" | "complete" | "error";

interface StreamState {
  stage: StreamStage;
  message?: string;
  content: string;
  isStreaming: boolean;
  draftId?: number;
  error?: string;
}

interface DraftGenerationOptions {
  sessionId: number;
  query: string;
  draftType: string;
  language: string;
}

function saveDraft(draftId: number, payload: { query: string; content: string; createdAt: number }) {
  try {
    localStorage.setItem(`draft:${draftId}`, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}

export function useDraftStream() {
  const [state, setState] = useState<StreamState>({
    stage: "researcher",
    content: "",
    isStreaming: false,
  });

  const generateDraft = useCallback(async (options: DraftGenerationOptions) => {
    setState({ stage: "researcher", content: "", isStreaming: true, message: "Initiating research..." });

    try {
      // Map session-based UI to case-based API. For now, sessionId is treated as case ID.
      const caseId = String(options.sessionId);

      setState((p) => ({ ...p, stage: "verifier", message: "Verifying citations and standards..." }));
      const res = await apiClient.runResearch(caseId, {
        query: options.query,
        incident_type: "unknown",
        evidence_type: "unknown",
        procedural_defects: [],
        mode: "draft",
      });

      if (!res.success) {
        throw new Error(res.error || "Draft generation failed");
      }

      const draftId = Date.now();
      setState((p) => ({
        ...p,
        stage: "complete",
        message: "Generation complete.",
        content: res.draft || "",
        isStreaming: false,
        draftId,
      }));
      saveDraft(draftId, { query: options.query, content: res.draft || "", createdAt: Date.now() });
      return draftId;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        stage: "error",
        error: error.message || "An error occurred",
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ stage: "researcher", content: "", isStreaming: false });
  }, []);

  return { state, generateDraft, reset };
}
