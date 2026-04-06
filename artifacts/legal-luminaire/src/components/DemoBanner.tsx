/**
 * DemoBanner — shown on demo-mode pages.
 * Accuracy rule: demo mode must always be visually distinct from real case mode.
 */
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="w-full bg-amber-50 border-b border-amber-300 px-4 py-2 flex items-center gap-3 text-amber-800 text-sm no-print">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
      <span className="flex-1">
        <strong>DEMO MODE</strong> — Synthetic data only. All citations are placeholders.{" "}
        <span className="font-semibold">NOT FOR FILING IN ANY COURT.</span>
      </span>
      <Link href="/intake">
        <span className="underline cursor-pointer font-medium hover:text-amber-900">
          Start with real case →
        </span>
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 p-1 rounded hover:bg-amber-200 transition-colors"
        aria-label="Dismiss demo banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
