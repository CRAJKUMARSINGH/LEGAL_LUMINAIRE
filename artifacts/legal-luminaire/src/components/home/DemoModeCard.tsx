import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PlayCircle, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCaseContext } from "@/context/CaseContext";
import { HEMRAJ_DEMO_ID } from "@/cases/registry";
import { CreateCaseQuickDialog } from "@/components/create-case-quick-dialog";
import { featureFlags } from "@/config/featureFlags";

/**
 * One-click Demo Mode. Loads the full synthetic CASE_01 (Hemraj) data set into
 * the active case and opens its dashboard — 1 click from Home.
 */
export function DemoModeCard() {
  const { loadDemoCase, isLoading } = useCaseContext();
  const [, setLocation] = useLocation();
  const [busy, setBusy] = useState(false);

  const activate = async () => {
    setBusy(true);
    try {
      const id = await loadDemoCase(HEMRAJ_DEMO_ID);
      if (id) setLocation(`/case/${id}/dashboard`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="demo-mode-card"
      className="rounded-xl border-2 border-amber-400 bg-amber-50/90 backdrop-blur-md p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover-elevate transition-colors"
    >
      <PlayCircle className="h-9 w-9 text-amber-500 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-amber-900 text-sm">डेमो मोड / Demo Mode</p>
          <Badge className="bg-amber-500 text-white text-[9px] font-black tracking-widest">SYNTHETIC / DEMO</Badge>
        </div>
        <p className="text-xs text-amber-800 mt-0.5">
          हेमराज (कृत्रिम) केस का पूरा डेटा — टाइमलाइन, नज़ीर मैट्रिक्स, मानक, दस्तावेज़, प्रार्थना — एक क्लिक में लोड करें।{" "}
          Loads the full CASE_01 data set (timeline, case-law &amp; standards matrices, documents, prayer, verification blocks). No API key needed.
        </p>
        <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" /> किसी न्यायालय में दाखिल न करें · Not for filing in any court.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0 sm:justify-end">
        <Button
          size="sm"
          onClick={activate}
          disabled={busy || isLoading}
          data-testid="load-demo-hemraj"
          className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />}
          Load Demo Case (Hemraj – Synthetic)
        </Button>
        <Link href="/demo-browser">
          <Button size="sm" variant="outline" className="border-amber-400 text-amber-800 hover:bg-amber-100 gap-1.5">
            26 टेस्ट केस / Test Data Browser
          </Button>
        </Link>
        {featureFlags.referenceQuickCaseDialog && (
          <CreateCaseQuickDialog triggerClassName="bg-background border border-amber-400 text-amber-900 hover:bg-amber-100 text-sm h-9" />
        )}
      </div>
    </div>
  );
}
