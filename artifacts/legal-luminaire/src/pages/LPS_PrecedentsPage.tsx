import React from "react";
import { verifiedPrecedents, iea114Note, type VerifiedPrecedent } from "@/data/verifiedPrecedents";
import { BookOpen, CheckCircle, AlertTriangle, Info, Scale } from "lucide-react";

const statusConfig: Record<string, { label: string; bg: string; dot: string; icon: React.ReactNode; note: string }> = {
  VERIFIED: {
    label: "VERIFIED",
    bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    dot: "bg-emerald-500",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    note: "Citation confirmed from two independent indexed sources. Principle matches verified ratio decidendi.",
  },
  CITATION_CORRECTED: {
    label: "CITATION CORRECTED",
    bg: "bg-amber-50 border-amber-300 text-amber-800",
    dot: "bg-amber-500",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    note: "Earlier draft had an error in this citation. Corrected version below. Verify from original law report volume before filing.",
  },
  PARA_VERIFY_FROM_LAW_REPORT: {
    label: "PARA REF PENDING",
    bg: "bg-blue-50 border-blue-200 text-blue-800",
    dot: "bg-blue-500",
    icon: <Info className="w-3.5 h-3.5" />,
    note: "Citation and principle verified. Paragraph / page numbers must be confirmed from original SCC or AIR volume at a law library before use in formal submission.",
  },
};

function PrecedentCard({ p }: { p: VerifiedPrecedent }) {
  const cfg = statusConfig[p.status];
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Status stripe */}
      <div className={`flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold ${cfg.bg}`}>
        {cfg.icon}
        <span>{cfg.label}</span>
        <span className="ml-auto font-normal opacity-80 max-w-xs text-right leading-snug hidden sm:block">
          {cfg.note}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div>
            <h3 className="font-bold text-[14px] text-foreground leading-snug">{p.fullTitle}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {p.citation_air && (
                <span className="text-xs font-mono text-primary font-semibold">{p.citation_air}</span>
              )}
              {p.citation_scc && (
                <span className="text-xs font-mono text-primary font-semibold">{p.citation_scc}</span>
              )}
              {p.citation_scr && (
                <span className="text-xs font-mono text-muted-foreground">{p.citation_scr}</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-muted-foreground">{p.bench}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Decided: {p.decided}</div>
          </div>
        </div>

        {/* Correction note */}
        {p.correctionNote && (
          <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 leading-relaxed">
            <strong>Correction: </strong>{p.correctionNote}
          </div>
        )}

        {/* Confirmed paras */}
        {p.confirmedParas && (
          <div className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 leading-relaxed">
            <strong>Confirmed Para: </strong>{p.confirmedParas}
          </div>
        )}

        {/* Para verification note */}
        {p.paraVerificationNote && (
          <div className="mb-3 rounded-lg bg-muted/50 border border-border px-3 py-2 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Law-Library Note: </strong>{p.paraVerificationNote}
          </div>
        )}

        {/* Ratio */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Ratio — हिंदी</div>
            <p className="text-[12.5px] leading-[1.85] text-foreground">{p.ratio_hi}</p>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Ratio — English</div>
            <p className="text-[12.5px] leading-[1.85] text-foreground italic">{p.ratio_en}</p>
          </div>
        </div>

        {/* Grounds */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Applies to:</span>
          {p.groundsApplicable.map((g) => (
            <span key={g} className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Ground {g}
            </span>
          ))}
          <span className="text-xs text-muted-foreground ml-1">— {p.groundsLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function PrecedentsPage() {
  const verified = verifiedPrecedents.filter((p) => p.status === "VERIFIED");
  const corrected = verifiedPrecedents.filter((p) => p.status === "CITATION_CORRECTED");

  const removedCases = [
    { name: "N. Sri Rama Reddy v. V.V. Giri, AIR 1971 SC 1162", reason: "Presidential election case (1969 V.V. Giri election). Principle attributed (burden of proving compliance) is NOT the ratio of this case." },
    { name: "DDA v. Skipper Construction, (1996) 4 SCC 622", reason: "Contempt of court / failure to deposit auction consideration. Construction quality principle attributed is NOT the ratio." },
    { name: "NBCC v. S. Raghunathan, (1998) 7 SCC 66", reason: "Service law / pay revision case (CPWD officials on deputation). Technical-report principle attributed is NOT the ratio." },
    { name: "State of Punjab v. Bhag Singh, (2004) 1 SCC 163", reason: "No independent indexed source confirmed the citation with the attributed principle. Removed pending law library verification." },
    { name: "Ram Chandra Singh v. Savitri Devi, (2003) 8 SCC 319", reason: "Fraud on court / matrimonial law case. Technical-report completeness principle attributed is NOT the ratio." },
    { name: "Sterlite Industries v. Union of India, (2013) 4 SCC 575", reason: "Environmental violations / copper smelter plant case (Tuticorin). Expert-evidence methodology principle attributed is NOT the ratio." },
    { name: "Gomathinayagam Pillai v. Palaniswami Nadar, AIR 1967 SC 868", reason: "Immovable property / murder-trial context case. Adverse-inference principle now cited directly from S.114 Illustration (g) IEA — a statutory provision — which is more authoritative and precise." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SC / HC Precedents — Verified</h1>
            <p className="text-muted-foreground text-sm">
              Each citation cross-checked against two independent indexed sources · Principle matched to ratio decidendi · Para numbers noted where confirmed
            </p>
          </div>
        </div>
      </div>

      {/* Verification standard callout */}
      <div className="mb-7 rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-4">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed text-foreground">
            <strong className="text-primary">Verification Standard Applied — Five Agents of Prudence</strong>
            <ol className="mt-2 space-y-1 list-decimal list-inside text-muted-foreground text-[12.5px]">
              <li>Citation (AIR / SCC / SCR) confirmed from a minimum of two independent indexed sources (Indian Kanoon, SCC Online summaries, AIR Online, published academic analyses).</li>
              <li>Principle attributed verified to match the actual ratio decidendi — not a peripheral observation — of the case.</li>
              <li>Party names, court level, bench composition and date of decision confirmed.</li>
              <li>Paragraph numbers noted where confirmed from indexed source; otherwise a law-library verification note is added.</li>
              <li>Seven cases present in earlier drafts removed after audit — full audit trail shown below under "Removed Cases".</li>
            </ol>
            <p className="mt-2 text-[12px] font-semibold text-destructive">
              ⚠ Counsel must verify paragraph / page numbers from original SCC or AIR report volumes at a recognised law library before citing in any formal pleading or submission.
            </p>
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
        {Object.entries(statusConfig).map(([k, v]) => (
          <div key={k} className={`rounded-lg border p-3 text-xs ${v.bg}`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${v.dot}`} />
              {v.label}
            </div>
            <div className="opacity-80 leading-snug">{v.note}</div>
          </div>
        ))}
      </div>

      {/* Verified cases */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Verified Precedents ({verified.length})
        </h2>
        <div className="space-y-4">
          {verified.map((p) => <PrecedentCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Citation-corrected cases */}
      {corrected.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Corrected Citations ({corrected.length})
          </h2>
          <div className="space-y-4">
            {corrected.map((p) => <PrecedentCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* Statutory authority */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          Statutory Authority — Indian Evidence Act 1872
        </h2>
        <div className="rounded-xl border-2 border-primary/20 bg-card p-5">
          <div className="font-bold text-sm text-primary mb-2">{iea114Note.provision}</div>
          <p className="text-[13px] leading-[1.9] text-foreground mb-2">{iea114Note.text_hi}</p>
          <p className="text-[13px] leading-[1.9] text-muted-foreground italic">{iea114Note.text_en}</p>
          <div className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-3">
            Applied in: Ground 4 (storage records not produced) · Ground 7 (counterpart sample not retained). This is primary statutory law and requires no judicial precedent to support it.
          </div>
        </div>
      </section>

      {/* Key statutes */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground inline-block" />
          Other Statutory Provisions Relied Upon
        </h2>
        <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3">
          {[
            { s: "Section 45, Indian Evidence Act, 1872", d: "Expert opinion is admissible only when the opinion is expressed by a person specially skilled. The test report author must qualify as an expert, disclose their qualifications, and disclose the methodology used. Applied: Grounds 8, 9." },
            { s: "Article 14, Constitution of India", d: "Equality and non-arbitrariness in state action — an enquiry authority that deliberately chooses a stormy, flood-day to collect samples acts arbitrarily and in violation of Art. 14. Applied: Grounds 1, 2." },
            { s: "Article 311(2), Constitution of India", d: "A government servant cannot be dismissed or penalised without being given a reasonable opportunity of showing cause against the action proposed. Applied: Grounds 1, 6." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 text-sm border-b border-border last:border-0 pb-3 last:pb-0">
              <span className="font-semibold text-primary flex-shrink-0 leading-relaxed">{item.s}</span>
              <span className="text-muted-foreground leading-relaxed">{item.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIT TRAIL — Removed cases */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-destructive mb-4 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          Audit Trail — Cases Removed from Earlier Draft ({removedCases.length} cases)
        </h2>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-destructive/20 text-xs text-destructive font-semibold">
            These citations appeared in earlier drafts of this tool. They have been removed because the principle attributed to each case was found NOT to match its actual ratio decidendi. Do not cite these cases for the propositions stated in earlier drafts.
          </div>
          <div className="divide-y divide-destructive/10">
            {removedCases.map((c, i) => (
              <div key={i} className="px-4 py-3 flex gap-3 text-sm">
                <BookOpen className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-[13px]">{c.name}</div>
                  <div className="text-muted-foreground text-[12px] mt-0.5 leading-relaxed">{c.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
