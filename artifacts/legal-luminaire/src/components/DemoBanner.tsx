import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";

/**
 * Persistent (non-dismissible) SYNTHETIC / DEMO banner. Mounted by `Layout`
 * whenever the active case is a demo record.
 */
export function DemoBanner({ caseTitle }: { caseTitle?: string }) {
  return (
    <div
      role="status"
      className="w-full bg-amber-50 border-b border-amber-300 px-4 py-1.5 flex items-center gap-3 text-amber-900 text-xs no-print"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
      <span className="flex-1 leading-snug">
        <strong className="tracking-widest">SYNTHETIC / DEMO</strong>
        {caseTitle && <span className="hidden md:inline"> — {caseTitle}</span>}
        {" "}· कृत्रिम डेटा — किसी भी न्यायालय में दाखिल न करें · Synthetic data, placeholder citations —{" "}
        <span className="font-semibold">NOT FOR FILING IN ANY COURT.</span>
      </span>
      <Link href="/intake" className="underline font-medium hover:text-amber-950 whitespace-nowrap">
        वास्तविक केस शुरू करें / Start real case →
      </Link>
    </div>
  );
}
