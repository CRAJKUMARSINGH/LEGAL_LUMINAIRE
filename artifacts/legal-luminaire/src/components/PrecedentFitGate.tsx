import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import type { FitLevel } from "@/lib/ai-research";

type Props = {
  precedentName: string;
  citation: string;
  fitScore: number;
  fitLevel: FitLevel;
  fitReason: string;
  holding: string;
  application: string;
  children?: React.ReactNode;
};

const fitConfig: Record<FitLevel, { label: string; color: string; icon: React.ElementType; border: string }> = {
  exact: {
    label: "Exact Match — Primary Authority",
    color: "text-green-800 bg-green-50",
    icon: CheckCircle2,
    border: "border-green-300",
  },
  analogous: {
    label: "Analogous — Use with Qualification",
    color: "text-blue-800 bg-blue-50",
    icon: Info,
    border: "border-blue-300",
  },
  weak: {
    label: "Weak Fit — Supporting Only",
    color: "text-amber-800 bg-amber-50",
    icon: AlertTriangle,
    border: "border-amber-300",
  },
  rejected: {
    label: "REJECTED — Factual Mismatch — DO NOT USE",
    color: "text-red-800 bg-red-50",
    icon: XCircle,
    border: "border-red-400",
  },
};

export default function PrecedentFitGate({
  precedentName,
  citation,
  fitScore,
  fitLevel,
  fitReason,
  holding,
  application,
  children,
}: Props) {
  const [expanded, setExpanded] = useState(fitLevel !== "rejected");
  const cfg = fitConfig[fitLevel];
  const Icon = cfg.icon;

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${cfg.border}`}>
      <button
        onClick={() => setExpanded((p) => !p)}
        className={`w-full flex items-start gap-3 p-4 text-left ${cfg.color}`}
      >
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm">{precedentName}</span>
            <span className="text-xs opacity-70">{citation}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-semibold">{cfg.label}</span>
            <span className="text-xs opacity-80">Fit: {fitScore}/100</span>
          </div>
          <p className="text-xs mt-0.5 opacity-75">{fitReason}</p>
        </div>
        <span className="text-xs opacity-60 flex-shrink-0">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && fitLevel !== "rejected" && (
        <div className="bg-card border-t border-border p-4 space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-semibold text-foreground mb-1">मुख्य अभिधारण / Holding:</p>
            <p className="text-xs text-foreground/80 italic leading-relaxed">{holding}</p>
          </div>
          <div className="p-3 bg-accent/30 rounded-lg">
            <p className="text-xs font-semibold text-accent-foreground mb-1">इस केस में प्रयोग / Application:</p>
            <p className="text-xs text-accent-foreground/80 leading-relaxed">{application}</p>
          </div>
          {children}
        </div>
      )}

      {fitLevel === "rejected" && (
        <div className="bg-red-50 border-t border-red-200 p-3">
          <p className="text-xs text-red-700 font-semibold">
            ⚠ FATAL ERROR — This precedent does not factually match the current case.
            Using it as primary authority will weaken your argument.
            Reason: {fitReason}
          </p>
        </div>
      )}
    </div>
  );
}
