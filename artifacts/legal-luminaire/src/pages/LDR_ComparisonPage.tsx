import type { Lang } from "../data/defenceData";
import { replyFacts } from "../data/defenceData";

interface Props { lang: Lang; }

const NAVY = "#18294F";
const GOLD = "#B48C1E";

/* ── Ratio helpers ─────────────────────────────────────────────────────── */
/** cement fraction of a 2-part ratio 1:x → 1/(1+x) */
const cf2 = (x: number) => (1 / (1 + x)) * 100;
/** cement fraction of a 3-part ratio 1:f:c → 1/(1+f+c) */
const cf3 = (f: number, c: number) => (1 / (1 + f + c)) * 100;

const DATA = [
  {
    id: "A",
    labelEn: "Packet A — Plaster",
    labelHi: "पैकेट A — प्लास्टर",
    material: "CM 1:6 (cement–sand)",
    materialHi: "CM 1:6 (सीमेंट–रेत)",
    specRatio: "1 : 6",
    fslRatio: "1 : 6",
    specCF: cf2(6),
    fslCF: cf2(6),
    verdict: "MATCH" as const,
    verdictHi: "मेल",
    deviationEn: "No deviation — FSL confirms the G-Schedule ratio exactly. Prosecution's case does NOT rest on Packet A.",
    deviationHi: "कोई विचलन नहीं — FSL जी-शिड्यूल अनुपात की पुष्टि करता है। अभियोजन का मामला पैकेट A पर आधारित नहीं है।",
    challengeEn: "Even so, procedural violations (no contractor present, rain conditions, uncontrolled storage) apply identically to Packet A — the sample must be excluded on grounds independent of the ratio.",
    challengeHi: "फिर भी, प्रक्रियागत उल्लंघन (ठेकेदार अनुपस्थित, वर्षा, अनियंत्रित भंडारण) पैकेट A पर भी समान रूप से लागू होते हैं।",
    color: { bar: "bg-green-500", bg: "bg-green-50", border: "border-green-400", badge: "bg-green-600", text: "text-green-700" },
  },
  {
    id: "B",
    labelEn: "Packet B — Masonry Mortar",
    labelHi: "पैकेट B — चिनाई मोर्टार",
    material: "CM 1:4 (cement–sand)",
    materialHi: "CM 1:4 (सीमेंट–रेत)",
    specRatio: "1 : 4",
    fslRatio: "1 : 17",
    specCF: cf2(4),
    fslCF: cf2(17),
    verdict: "MISMATCH" as const,
    verdictHi: "अंतर",
    deviationEn: "4.25× excess sand in FSL result. Cement fraction drops from 20.0% → 5.6% — a 72% deficit. The decisive cause: marble stone masonry contamination during in-situ chipping. Stone silica (SiO₂) raises the total silica pool, falsely suppressing the calculated cement fraction in IS 4031 (Part 5):1988 chemical analysis.",
    deviationHi: "FSL परिणाम में 4.25 गुना अधिक रेत। सीमेंट अंश 20.0% → 5.6% — 72% कमी। निर्णायक कारण: स्वस्थाने चिपिंग के दौरान पत्थर की चिनाई का संदूषण। पत्थर का सिलिका (SiO₂) कुल सिलिका बढ़ाकर IS 4031 (Part 5):1988 विश्लेषण में सीमेंट अंश घटाता है।",
    challengeEn: "A masonry joint width of 10–20 mm makes it physically impossible to extract only mortar with a chisel — stone fragments inevitably enter. The standing wall disproves the 1:17 ratio: masonry at 1:17 disintegrates within 24 hours.",
    challengeHi: "10–20 मिमी जोड़ की चौड़ाई में छैनी से केवल मोर्टार निकालना भौतिक रूप से असंभव है — पत्थर के टुकड़े अनिवार्य रूप से मिलते हैं। खड़ी दीवार 1:17 अनुपात को नकारती है: 1:17 मिश्रण 24 घंटे में ढह जाता है।",
    color: { bar: "bg-red-500", bg: "bg-red-50", border: "border-red-400", badge: "bg-red-600", text: "text-red-700" },
  },
  {
    id: "C",
    labelEn: "Packet C — Foundation Concrete (PCC)",
    labelHi: "पैकेट C — नींव कंक्रीट (PCC)",
    material: "PCC 1:4:8 (cement–sand–aggregate)",
    materialHi: "PCC 1:4:8 (सीमेंट–रेत–गिट्टी)",
    specRatio: "1 : 4 : 8",
    fslRatio: "1 : 5¾ : 9½",
    specCF: cf3(4, 8),
    fslCF: cf3(5.75, 9.5),
    verdict: "MISMATCH" as const,
    verdictHi: "अंतर",
    deviationEn: "Cement fraction drops from 7.7% → 6.2% — a 19.5% deficit. The decisive cause: IS 4031 (Part 5):1988 gravimetric (silica-dissolution) method is designed for mortar, not concrete. Coarse aggregate (stone grit, 20–40 mm) contains its own silica (SiO₂). Its dissolution inflates total silica, directly suppressing the cement fraction. The correct method for concrete is IS 516:1959 (cube crushing) or IS 1199 (Part 1):2018.",
    deviationHi: "सीमेंट अंश 7.7% → 6.2% — 19.5% कमी। निर्णायक कारण: IS 4031 (Part 5):1988 ग्रेविमेट्रिक विधि मोर्टार के लिए है, कंक्रीट के लिए नहीं। मोटे समुच्चय में अपना SiO₂ होता है जो कुल सिलिका बढ़ाकर सीमेंट अंश घटाता है। कंक्रीट के लिए सही विधि: IS 516:1959 या IS 1199 (Part 1):2018।",
    challengeEn: "Additionally, 1:4:8 PCC is a lean lean-mix foundation-grade concrete — its specification was deliberately selected for durability under subgrade conditions. The FSL result of 1:5¾:9½ is within the range of a 1:5:10 lean mix, which is still used for levelling courses. The deviation is driven by the wrong test method, not by actual mix non-compliance.",
    challengeHi: "1:4:8 PCC एक दुर्बल नींव-श्रेणी का कंक्रीट है। FSL परिणाम 1:5¾:9½ 1:5:10 लीन मिक्स के दायरे में है जो अभी भी लेवलिंग कोर्स में उपयोग होता है। विचलन गलत परीक्षण विधि के कारण है, वास्तविक मिश्रण गैर-अनुपालन के कारण नहीं।",
    color: { bar: "bg-orange-500", bg: "bg-orange-50", border: "border-orange-400", badge: "bg-orange-600", text: "text-orange-700" },
  },
];

/* ── Visual bar component ───────────────────────────────────────────────── */
function CementBar({
  label, labelHi, cf, color, maxCF, lang, tag,
}: {
  label: string; labelHi: string; cf: number; color: string; maxCF: number; lang: Lang; tag?: string;
}) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  const pct = Math.round((cf / maxCF) * 100);
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] font-semibold text-[#18294F]">
          {showEn ? label : labelHi}
          {lang === "both" && <span className="text-[#18294F]/50 ml-1">({labelHi})</span>}
        </span>
        <span className="text-[10px] font-bold text-[#18294F]">{cf.toFixed(1)}%</span>
      </div>
      <div className="h-5 w-full bg-[#18294F]/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full flex items-center justify-end pr-2 transition-all ${color}`}
          style={{ width: `${pct}%` }}
        >
          {tag && <span className="text-[8px] font-bold text-white">{tag}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Per-packet card ────────────────────────────────────────────────────── */
function PacketCard({ d, lang, maxCF }: { d: typeof DATA[number]; lang: Lang; maxCF: number }) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  const isMatch = d.verdict === "MATCH";
  const deviation = isMatch ? 0 : Math.round(((d.specCF - d.fslCF) / d.specCF) * 100);

  return (
    <div className={`border rounded-lg overflow-hidden mb-5 ${d.color.border} ${d.color.bg}`}>
      {/* Card header */}
      <div className={`px-4 py-2 flex items-center justify-between ${isMatch ? "bg-green-600" : d.id === "B" ? "bg-red-600" : "bg-orange-500"}`}>
        <div>
          <span className="text-white text-xs font-bold">
            {showEn ? d.labelEn : d.labelHi}
            {lang === "both" && <span className="font-normal opacity-75 ml-2">({d.labelHi})</span>}
          </span>
          <span className="text-white/70 text-[10px] ml-2">{d.material}</span>
        </div>
        <span className={`text-white text-[11px] font-bold px-2 py-0.5 rounded border border-white/40 ${isMatch ? "bg-green-700" : "bg-black/20"}`}>
          {showEn ? d.verdict : d.verdictHi}
        </span>
      </div>

      <div className="px-4 py-3">
        {/* Ratio comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded border border-[#B48C1E]/40 px-3 py-2 text-center">
            <p className="text-[9px] uppercase tracking-wider text-[#18294F]/50 mb-1">
              {showEn ? "G-Schedule Specification" : "जी-शिड्यूल विनिर्देश"}
            </p>
            <p className="text-xl font-bold text-green-700">{d.specRatio}</p>
            <p className="text-[9px] text-[#18294F]/50 mt-0.5">{d.materialHi}</p>
          </div>
          <div className={`rounded border px-3 py-2 text-center bg-white ${isMatch ? "border-green-400" : "border-red-400"}`}>
            <p className="text-[9px] uppercase tracking-wider text-[#18294F]/50 mb-1">
              {showEn ? "FSL Report (15.04.2012)" : "FSL रिपोर्ट (15.04.2012)"}
            </p>
            <p className={`text-xl font-bold ${isMatch ? "text-green-700" : "text-red-700"}`}>{d.fslRatio}</p>
            {!isMatch && (
              <p className="text-[9px] text-red-600 font-semibold mt-0.5">
                {showEn ? `−${deviation}% cement` : `−${deviation}% सीमेंट`}
              </p>
            )}
            {isMatch && <p className="text-[9px] text-green-600 font-semibold mt-0.5">✓ Exact match</p>}
          </div>
        </div>

        {/* Bar chart — cement fraction */}
        <div className="bg-white rounded border border-[#B48C1E]/20 px-3 py-3 mb-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#18294F]/50 mb-2">
            {showEn ? "Cement fraction in total mix" : "कुल मिश्रण में सीमेंट अंश"}
          </p>
          <CementBar
            label="G-Schedule spec"
            labelHi="जी-शिड्यूल विनिर्देश"
            cf={d.specCF}
            color="bg-green-500"
            maxCF={maxCF}
            lang={lang}
            tag="Spec"
          />
          <CementBar
            label="FSL result"
            labelHi="FSL परिणाम"
            cf={d.fslCF}
            color={isMatch ? "bg-green-500" : d.id === "B" ? "bg-red-500" : "bg-orange-500"}
            maxCF={maxCF}
            lang={lang}
            tag="FSL"
          />
          {!isMatch && (
            <div className={`mt-2 text-[10px] font-bold ${d.color.text} flex items-center gap-1`}>
              <span>↓</span>
              <span>
                {d.id === "B"
                  ? (showEn ? "4.25× excess sand — 72% cement deficit" : "4.25 गुना अधिक रेत — 72% सीमेंट की कमी")
                  : (showEn ? "1.25× excess aggregate — 19.5% cement deficit" : "1.25 गुना अधिक समुच्चय — 19.5% सीमेंट की कमी")}
              </span>
            </div>
          )}
        </div>

        {/* Deviation / challenge explanation */}
        <div className={`rounded border px-3 py-2 text-[10px] leading-relaxed ${isMatch ? "bg-green-50 border-green-200 text-green-800" : "bg-white border-[#B48C1E]/20 text-[#18294F]/80"}`}>
          <p className="font-semibold mb-1">
            {isMatch
              ? (showEn ? "Why the result matches — and still matters:" : "परिणाम मेल क्यों — और फिर भी क्यों महत्वपूर्ण:")
              : (showEn ? "Decisive cause of deviation:" : "विचलन का निर्णायक कारण:")}
          </p>
          {showEn && <p>{isMatch ? d.challengeEn : d.deviationEn}</p>}
          {lang === "both" && <p className="italic opacity-70 mt-1">{isMatch ? d.challengeHi : d.deviationHi}</p>}
          {lang === "hi" && <p>{isMatch ? d.challengeHi : d.deviationHi}</p>}
          {!isMatch && (
            <>
              <p className="font-semibold mt-2 mb-1">
                {showEn ? "Physical impossibility argument:" : "भौतिक असंभाव्यता तर्क:"}
              </p>
              {showEn && <p>{d.challengeEn}</p>}
              {lang === "both" && <p className="italic opacity-70 mt-1">{d.challengeHi}</p>}
              {lang === "hi" && <p>{d.challengeHi}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Summary deviation chart ─────────────────────────────────────────────── */
function DeviationSummary({ lang }: { lang: Lang }) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  const rows = [
    { packet: "A", deviation: 0, color: "bg-green-500", labelEn: "No deviation (0%)", labelHi: "कोई विचलन नहीं (0%)" },
    { packet: "B", deviation: 72, color: "bg-red-500", labelEn: "−72% cement deficit", labelHi: "−72% सीमेंट की कमी" },
    { packet: "C", deviation: 19.5, color: "bg-orange-500", labelEn: "−19.5% cement deficit", labelHi: "−19.5% सीमेंट की कमी" },
  ];
  return (
    <div className="border border-[#B48C1E] rounded-lg overflow-hidden mb-6">
      <div className="bg-[#18294F] text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
        {showEn ? "Deviation Summary — Specified vs FSL Cement Fraction" : ""}
        {lang === "both" ? " / " : ""}
        {showHi ? "विचलन सारांश — विनिर्दिष्ट बनाम FSL सीमेंट अंश" : ""}
      </div>
      <div className="px-4 py-4 bg-white space-y-3">
        {rows.map(r => (
          <div key={r.packet}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-[#18294F]">
                {showEn ? `Packet ${r.packet}: ${r.labelEn}` : `पैकेट ${r.packet}: ${r.labelHi}`}
                {lang === "both" && <span className="text-[#18294F]/50 ml-2">({r.labelHi})</span>}
              </span>
              <span className="text-[10px] font-bold text-[#18294F]">{r.deviation === 0 ? "✓ 0%" : `${r.deviation}%`}</span>
            </div>
            <div className="h-4 w-full bg-[#18294F]/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${r.color}`}
                style={{ width: `${r.deviation === 0 ? 2 : r.deviation}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-[#18294F]/60 italic pt-1 border-t border-[#B48C1E]/20">
          {showEn ? "Bar = percentage of specified cement fraction that is missing in the FSL result. Packet A has zero deficit — confirming FSL's method can produce correct results when contamination is absent." : ""}
          {lang === "both" && <span className="block mt-1">{showHi ? "बार = FSL परिणाम में विनिर्दिष्ट सीमेंट अंश की कमी का प्रतिशत। पैकेट A में कोई कमी नहीं — FSL विधि सही परिणाम दे सकती है जब संदूषण अनुपस्थित हो।" : ""}</span>}
          {lang === "hi" ? "बार = FSL परिणाम में विनिर्दिष्ट सीमेंट अंश की कमी का प्रतिशत। पैकेट A में शून्य कमी — FSL विधि उचित परिस्थितियों में सही परिणाम दे सकती है।" : ""}
        </p>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function ComparisonPage({ lang }: Props) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  const { gScheduleComparison } = replyFacts;
  const maxCF = 25; // Axis max — just above Packet B spec (20%)

  return (
    <div className="font-serif text-[#18294F]">

      {/* HEADER */}
      <div className="bg-[#18294F] text-white rounded-lg px-6 py-4 mb-6 text-center">
        <p className="text-[#B48C1E] text-[10px] tracking-widest uppercase mb-1">G-Schedule vs FSL Report</p>
        <h1 className="text-lg font-bold mb-1">
          {showEn ? "Ratio Comparison — Specification vs FSL Result" : ""}
          {lang === "both" && <span className="block text-sm font-normal text-white/70 mt-0.5">अनुपात तुलना — विनिर्देश बनाम FSL परिणाम</span>}
          {lang === "hi" ? "अनुपात तुलना — विनिर्देश बनाम FSL परिणाम" : ""}
        </h1>
        <p className="text-white/60 text-[10px]">
          {showEn ? "Random Inspection: 21.08.2010 | FSL Report: 15.04.2012 | Contractor: Hemraj" : ""}
          {lang === "both" ? " | " : ""}
          {showHi ? "आकस्मिक निरीक्षण: 21.08.2010 | FSL रिपोर्ट: 15.04.2012 | ठेकेदार: हेमराज" : ""}
        </p>
      </div>

      {/* KEY FINDING BANNER */}
      <div className="bg-[#B48C1E]/10 border border-[#B48C1E] rounded-lg px-4 py-3 mb-6 text-xs leading-relaxed text-[#18294F]">
        <span className="font-bold">
          {showEn ? "Key finding: " : ""}
          {showHi ? "मुख्य निष्कर्ष: " : ""}
        </span>
        {showEn ? `${gScheduleComparison.noteEn}` : ""}
        {lang === "both" && <span className="block italic text-[#18294F]/70 mt-1">{gScheduleComparison.noteHi}</span>}
        {lang === "hi" ? gScheduleComparison.noteHi : ""}
      </div>

      {/* DEVIATION SUMMARY CHART */}
      <DeviationSummary lang={lang} />

      {/* PACKET CARDS */}
      {DATA.map(d => <PacketCard key={d.id} d={d} lang={lang} maxCF={maxCF} />)}

      {/* SUMMARY TABLE */}
      <div className="border border-[#B48C1E] rounded-lg overflow-hidden mb-6">
        <div className="bg-[#18294F] text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
          {showEn ? "Summary Table" : ""}
          {lang === "both" ? " / " : ""}
          {showHi ? "सारांश तालिका" : ""}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#B48C1E]/10 text-[#18294F]">
              <tr>
                {["Packet / पैकेट", "Material / सामग्री", "Specification / विनिर्देश", "FSL Result / FSL परिणाम", "Cement % (Spec)", "Cement % (FSL)", "Deviation / विचलन", "Verdict / निर्णय"].map(h => (
                  <th key={h} className="text-left px-2 py-2 border-b border-[#B48C1E]/30 font-semibold text-[9px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA.map((d, i) => (
                <tr key={d.id} className={i % 2 === 1 ? "bg-[#B48C1E]/5" : ""}>
                  <td className="px-2 py-2 font-semibold">{d.id}</td>
                  <td className="px-2 py-2">{showEn ? d.material.split(" (")[0] : d.materialHi.split(" (")[0]}</td>
                  <td className="px-2 py-2 font-bold text-green-700">{d.specRatio}</td>
                  <td className={`px-2 py-2 font-bold ${d.verdict === "MATCH" ? "text-green-700" : "text-red-700"}`}>{d.fslRatio}</td>
                  <td className="px-2 py-2 text-right">{d.specCF.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-right font-semibold ${d.verdict === "MATCH" ? "text-green-700" : "text-red-700"}`}>{d.fslCF.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-right font-bold ${d.verdict === "MATCH" ? "text-green-700" : "text-red-700"}`}>
                    {d.verdict === "MATCH" ? "0%" : `−${Math.round(((d.specCF - d.fslCF) / d.specCF) * 100)}%`}
                  </td>
                  <td className="px-2 py-2">
                    <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${d.verdict === "MATCH" ? "bg-green-600" : "bg-red-600"}`}>
                      {showEn ? d.verdict : d.verdictHi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-[#B48C1E]/5 text-[10px] text-[#18294F]/60 border-t border-[#B48C1E]/20 italic">
          {showEn ? "Cement % = cement parts ÷ total parts × 100. Deviation = (Spec% − FSL%) ÷ Spec%." : ""}
          {lang === "both" ? " | " : ""}
          {showHi ? "सीमेंट % = सीमेंट भाग ÷ कुल भाग × 100। विचलन = (विनिर्देश% − FSL%) ÷ विनिर्देश%।" : ""}
        </div>
      </div>

      {/* CONTROL SAMPLE NOTE */}
      <div className="border border-red-300 bg-red-50 rounded-lg px-4 py-3 mb-6 text-xs leading-relaxed text-red-900">
        <p className="font-bold mb-1">
          {showEn ? "Effect of missing control sample on all three results:" : ""}
          {showHi ? "तीनों परिणामों पर नियंत्रण नमूने की अनुपस्थिति का प्रभाव:" : ""}
        </p>
        {showEn && <p>The FSL assumed 21% soluble silica in cement (no control sample supplied). IS 269:2015 specifies only a minimum of 17% SiO₂ — actual variation is ≈19–24%. A 2% underestimation of silica shifts every calculated cement:sand ratio by ≈10%, compounding the contamination errors in Packets B and C. Even the Packet A "match" is therefore subject to the same unverified assumption; the fact that Packet A shows 1:6 despite this confirms the wall was built to specification.</p>}
        {lang === "both" && <p className="italic mt-2 opacity-80">FSL ने सीमेंट में 21% घुलनशील सिलिका मानी (नियंत्रण नमूना नहीं मिला)। IS 269:2015 केवल न्यूनतम 17% SiO₂ निर्दिष्ट करता है — वास्तविक भिन्नता ≈19–24%। सिलिका का 2% कम अनुमान हर सीमेंट:रेत अनुपात को ≈10% बदलता है। पैकेट A का 1:6 मिलान इसी धारणा के बावजूद है — जो पुष्टि करता है कि दीवार विनिर्देश के अनुसार बनाई गई थी।</p>}
        {lang === "hi" && <p>FSL ने सीमेंट में 21% घुलनशील सिलिका मानी। IS 269:2015 केवल न्यूनतम 17% SiO₂ निर्दिष्ट करता है। सिलिका का 2% कम अनुमान हर अनुपात को ≈10% बदलता है — पैकेट B और C में संदूषण त्रुटियों को और बढ़ाता है।</p>}
      </div>

      <div className="no-print text-center mb-4">
        <button
          onClick={() => window.print()}
          className="bg-[#18294F] text-white px-8 py-2 rounded text-sm font-semibold hover:bg-[#1e3566] transition-colors"
        >
          {showEn ? "Print / Save as PDF" : ""}
          {lang === "both" ? " / " : ""}
          {showHi ? "प्रिंट / PDF के रूप में सहेजें" : ""}
        </button>
      </div>
    </div>
  );
}
