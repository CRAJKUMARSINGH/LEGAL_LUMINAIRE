/**
 * Judge Analytics Page
 * Route wrapper for Phase 5: Judge Analytics
 * Path: /case/:id/judge-analytics
 */

import { JudgeProfileCard } from "@/components/JudgeProfileCard";
import { CourtAnalyticsDashboard } from "@/components/CourtAnalyticsDashboard";
import { featureFlags } from "@/config/featureFlags";
import { useState } from "react";

export default function JudgeAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"judges" | "courts">("judges");

  if (!featureFlags.enableJudgeAnalytics && !featureFlags.enableCourtAnalytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Analytics is disabled. Set{" "}
          <code className="bg-muted px-1 rounded">VITE_FF_ENABLE_JUDGE_ANALYTICS=true</code>{" "}
          to activate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold text-foreground">Judge & Court Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Decision patterns, bail rates, conviction trends, disposal speed
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card px-6">
        {(["judges", "courts"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "judges" ? "Judge Profiles" : "Court Analytics"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "courts" ? (
          <CourtAnalyticsDashboard />
        ) : (
          <div className="text-sm text-muted-foreground text-center py-12">
            <p className="font-medium text-foreground mb-2">Judge Profiles</p>
            <p>Load judgment records to generate judge profiles.</p>
            <p className="mt-1 text-xs">Use the <code className="bg-muted px-1 rounded">buildJudgeProfile()</code> API with your case data.</p>
          </div>
        )}
      </div>
    </div>
  );
}