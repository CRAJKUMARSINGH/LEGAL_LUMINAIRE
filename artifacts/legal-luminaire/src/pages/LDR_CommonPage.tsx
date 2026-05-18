import { commonSection } from "@/data/defenceData";
import type { Lang } from "@/data/defenceData";

interface Props { lang: Lang; }

export default function CommonPage({ lang }: Props) {
  const showEn = lang !== "hi";
  const showHi = lang !== "en";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border-2 border-[#B48C1E] bg-[#18294F] text-white p-5">
        <h1 className="text-xl font-bold">
          {showEn && "The 21% Silica Assumption, Conclusions & Prayer"}
        </h1>
        {showHi && <div className="text-white/80 font-semibold">21% सिलिका मान्यता, निष्कर्ष एवं प्रार्थना पत्र</div>}
      </div>

      {/* FSL's own admission */}
      <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
        <p className="font-bold text-red-800 text-sm mb-2">FSL's Own Statement (Verbatim from Report)</p>
        <blockquote className="italic text-red-900 border-l-4 border-red-500 pl-4 text-sm leading-relaxed">
          "As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica."
        </blockquote>
        {showHi && (
          <blockquote className="italic text-red-800 border-l-4 border-red-400 pl-4 text-sm leading-relaxed mt-2">
            "नियंत्रण नमूना नहीं मिला, इसलिए यह मानकर कि उत्तम गुणवत्ता के सीमेंट में 21% घुलनशील सिलिका होती है, अनुपात की गणना की गई।"
          </blockquote>
        )}
      </div>

      {/* 21% Silica Assumption section */}
      <div className="rounded-lg border border-[#B48C1E] overflow-hidden">
        <div className="bg-[#B48C1E] text-white px-4 py-2 font-bold text-sm">
          Section: The Unverified 21% Silica Assumption
          {showHi && <span className="ml-2 font-normal text-white/80">— अप्रमाणित 21% सिलिका मान्यता</span>}
        </div>
        <div className="p-4 bg-yellow-50 space-y-3">
          {showEn && (
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {commonSection.silicaAssumptionEn}
            </div>
          )}
          {showHi && (
            <div className={`text-sm text-gray-800 leading-relaxed whitespace-pre-line ${showEn ? "border-t pt-3" : ""}`}>
              {commonSection.silicaAssumptionHi}
            </div>
          )}
        </div>
      </div>

      {/* Conclusions */}
      <div className="rounded-lg border border-[#18294F] overflow-hidden">
        <div className="bg-[#18294F] text-white px-4 py-2 font-bold text-sm">
          Conclusions
          {showHi && <span className="ml-2 font-normal text-white/80">— निष्कर्ष</span>}
        </div>
        <div className="p-4 bg-blue-50 space-y-3">
          {showEn && (
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {commonSection.conclusionEn}
            </div>
          )}
          {showHi && (
            <div className={`text-sm text-gray-800 leading-relaxed whitespace-pre-line ${showEn ? "border-t pt-3" : ""}`}>
              {commonSection.conclusionHi}
            </div>
          )}
        </div>
      </div>

      {/* Prayer */}
      <div className="rounded-lg border-2 border-green-600 overflow-hidden">
        <div className="bg-green-700 text-white px-4 py-2 font-bold text-sm">
          Prayer (Relief Sought)
          {showHi && <span className="ml-2 font-normal text-white/80">— प्रार्थना</span>}
        </div>
        <div className="p-4 bg-green-50 space-y-3">
          {showEn && (
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {commonSection.prayerEn}
            </div>
          )}
          {showHi && (
            <div className={`text-sm text-gray-800 leading-relaxed whitespace-pre-line ${showEn ? "border-t pt-3" : ""}`}>
              {commonSection.prayerHi}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 italic border-t pt-3">
        DISCLAIMER: All IS citations must be verified against BIS originals (bis.gov.in) before court use.
      </div>
    </div>
  );
}
