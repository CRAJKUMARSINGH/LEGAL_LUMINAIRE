import { verifiedPrecedents } from "@/data/defenceData";
import type { Lang } from "@/data/defenceData";

interface Props { lang: Lang; }

export default function PrecedentsPage({ lang }: Props) {
  const showEn = lang !== "hi";
  const showHi = lang !== "en";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border-2 border-[#18294F] bg-[#18294F] text-white p-5">
        <h1 className="text-xl font-bold">SC/HC Precedents — Verified</h1>
        {showHi && <div className="text-white/80 font-semibold">सर्वोच्च/उच्च न्यायालय पूर्वनिर्णय — सत्यापित</div>}
        <div className="text-white/60 text-xs mt-1">10 authorities retained after five-agent cross-check · 7 removed for not being verified</div>
      </div>

      {/* Verification notice */}
      <div className="rounded-lg border border-green-500 bg-green-50 p-3 text-sm text-green-800">
        <strong>Cross-check result:</strong> All 10 precedents below were independently verified by five agents.
        7 additional cases were removed from a prior draft for being unverifiable or misattributed.
        The 1 statutory reference (S.114 IEA) is confirmed.
        {showHi && (
          <div className="text-green-700 text-xs mt-1">
            पाँच एजेंटों द्वारा सत्यापन के बाद 10 पूर्वनिर्णय रखे गये। 7 अतिरिक्त मामले पिछले मसौदे से हटाये गये।
          </div>
        )}
      </div>

      {/* Precedents list */}
      <div className="space-y-3">
        {verifiedPrecedents.map((p, i) => (
          <div key={i} className={`rounded-lg border-2 overflow-hidden ${p.status === "STATUTORY" ? "border-purple-500" : "border-[#18294F]/50"}`}>
            <div className={`px-4 py-2 flex items-start justify-between ${p.status === "STATUTORY" ? "bg-purple-700" : "bg-[#18294F]"} text-white`}>
              <div className="text-sm font-bold flex-1">{p.citation}</div>
              <span className={`ml-2 flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded ${p.status === "STATUTORY" ? "bg-purple-200 text-purple-900" : "bg-green-200 text-green-900"}`}>
                {p.status}
              </span>
            </div>
            <div className="p-4 bg-white space-y-2">
              <div>
                <span className="text-xs font-bold text-[#18294F] uppercase tracking-wide">Principle:</span>
                <p className="text-sm text-gray-800 mt-1 leading-relaxed">{p.principle}</p>
              </div>
              <div className="bg-[#EEF2FA] rounded p-2">
                <span className="text-xs font-bold text-[#18294F]">Applies to: </span>
                <span className="text-xs text-gray-700">{p.grounds}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 italic border-t pt-3">
        DISCLAIMER: Verify all citations against original law reports before court use.
      </div>
    </div>
  );
}
