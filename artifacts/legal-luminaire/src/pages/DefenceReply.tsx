import { useEffect, useRef, useState } from "react";
import { Printer, Download, Copy, CheckCircle2, AlertTriangle, Clock, FileText } from "lucide-react";

// ── Verification badge helper ──────────────────────────────────────────────
type VS = "VERIFIED" | "SECONDARY" | "PENDING";
const vsBadge: Record<VS, string> = {
  VERIFIED:  "bg-green-100 text-green-800 border-green-300",
  SECONDARY: "bg-blue-100 text-blue-800 border-blue-300",
  PENDING:   "bg-red-100 text-red-800 border-red-300",
};
const vsIcon: Record<VS, React.ElementType> = {
  VERIFIED:  CheckCircle2,
  SECONDARY: Clock,
  PENDING:   AlertTriangle,
};
function VBadge({ s }: { s: VS }) {
  const Icon = vsIcon[s];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${vsBadge[s]}`}>
      <Icon className="w-3 h-3" />
      {s === "PENDING" ? "⚠ PENDING" : s}
    </span>
  );
}
