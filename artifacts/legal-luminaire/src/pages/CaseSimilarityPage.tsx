/**
 * Case Similarity Page
 * Route wrapper for Phase 4: AI Reasoning Layer
 * Path: /case/:id/case-similarity
 */

import { CaseSimilarityPanel } from "@/components/CaseSimilarityPanel";
import { featureFlags } from "@/config/featureFlags";

export default function CaseSimilarityPage() {
  if (!featureFlags.enableCaseSimilarity && !featureFlags.enableQueryUnderstanding) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          AI Reasoning is disabled. Set{" "}
          <code className="bg-muted px-1 rounded">VITE_FF_ENABLE_CASE_SIMILARITY=true</code>{" "}
          to activate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-foreground">Case Similarity Engine</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Multi-layer similarity scoring  Fact-Fit gate  Citation advice
        </p>
      </div>

      {/* Panel fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <CaseSimilarityPanel />
      </div>
    </div>
  );
}