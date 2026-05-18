import type { Lang } from "../data/defenceData";
import { replyFacts } from "../data/defenceData";

interface Props { lang: Lang; }

const NAVY = "#18294F";
const GOLD = "#B48C1E";

interface Event {
  date: string;
  dateHi: string;
  label: string;
  labelHi: string;
  detail: string;
  detailHi: string;
  type: "construction" | "inspection" | "sampling" | "storage" | "report" | "gap";
  critical?: boolean;
}

const EVENTS: Event[] = [
  {
    date: "2007",
    dateHi: "2007",
    label: "Construction begins — Cricket Stadium, Bhiwana",
    labelHi: "निर्माण प्रारंभ — क्रिकेट स्टेडियम, भीवाना",
    detail: "Boundary wall construction — plaster (CM 1:6), masonry (CM 1:4), foundation concrete (PCC 1:4:8) — per G-Schedule specification.",
    detailHi: "सीमा दीवार निर्माण — प्लास्टर (CM 1:6), चिनाई (CM 1:4), नींव का कंक्रीट (PCC 1:4:8) — जी-शिड्यूल के अनुसार।",
    type: "construction",
  },
  {
    date: "2007–2008",
    dateHi: "2007–2008",
    label: "Construction completed — heavy monsoon rains each year",
    labelHi: "निर्माण पूर्ण — प्रतिवर्ष भारी मानसून वर्षा",
    detail: "Work carried out during rainy season. The constructed wall was immediately exposed to repeated monsoon cycles from the moment of completion.",
    detailHi: "कार्य वर्षा ऋतु में किया गया। निर्माण पूर्ण होने के साथ ही दीवार प्रतिवर्ष मानसून वर्षा के संपर्क में आ गई।",
    type: "construction",
  },
  {
    date: "21.08.2010",
    dateHi: "21.08.2010",
    label: "Random inspection — all work found in order",
    labelHi: "आकस्मिक निरीक्षण — सभी कार्य सही पाया गया",
    detail: "Department random inspection (G-Schedule date). Work was inspected and passed at this date — approximately 2 years after construction. No defect recorded.",
    detailHi: "विभागीय आकस्मिक निरीक्षण (जी-शिड्यूल दिनांक)। इस तिथि को कार्य निरीक्षित कर पास किया गया — निर्माण के लगभग 2 वर्ष बाद। कोई दोष दर्ज नहीं।",
    type: "inspection",
  },
  {
    date: "2011",
    dateHi: "2011",
    label: "ACB samples collected — stormy, rainy day [CRITICAL]",
    labelHi: "ACB नमूना संग्रह — तूफानी, वर्षा वाला दिन [अत्यंत महत्वपूर्ण]",
    detail: "Samples collected ~2.5 years after construction. Site flooded: ~2 ft standing water. Marble slurry mixed with rainwater formed white quicksand throughout the stadium. Worker stood on wet steel ladder under umbrella, struck wall with hammer and chisel. FSL's own photographs in the court file confirm this. No contractor representative present. IS 1199 (Part 5):2018 Cl.5 violated.",
    detailHi: "निर्माण के लगभग 2.5 वर्ष बाद नमूने एकत्रित। स्थल पर ~2 फुट खड़ा पानी। मार्बल स्लरी वर्षा जल में घुलकर सफेद दलदल बन चुकी थी। मजदूर भीगी स्टील की सीढ़ी पर छाता लगाकर हथौड़ी-छैनी से दीवार तोड़ रहा था। FSL के स्वयं के फोटोग्राफ पत्रावली पर उपलब्ध। ठेकेदार प्रतिनिधि अनुपस्थित। IS 1199 (Part 5):2018 धारा 5 का उल्लंघन।",
    type: "sampling",
    critical: true,
  },
  {
    date: "2011 → 15.04.2012",
    dateHi: "2011 → 15.04.2012",
    label: "~6 months: samples stored in cement bags [CRITICAL]",
    labelHi: "~6 माह: नमूने सीमेंट के कट्टों में संग्रहीत [अत्यंत महत्वपूर्ण]",
    detail: "Samples stored in ordinary cement bags — porous, permeable to moisture. IS/IEC 17025:2017 Cl.7.4.3 requires storage in conditions preventing deterioration. Cement bags allow moisture ingress, accelerating the Ca(OH)₂ → CaCO₃ carbonation reaction that reduces apparent cement content. No collection date, storage date, or receipt date recorded in the FSL report — violating IS 1199 (Part 5):2018 Cl.6.",
    detailHi: "नमूने सामान्य सीमेंट के कट्टों में — नमी-पारगम्य। IS/IEC 17025:2017 धारा 7.4.3 के अनुसार भंडारण ऐसी परिस्थितियों में होना चाहिए जो क्षरण रोके। सीमेंट बोरे नमी प्रवेश देते हैं, Ca(OH)₂ → CaCO₃ कार्बोनेशन प्रतिक्रिया को तेज करते हैं। FSL रिपोर्ट में संग्रह, भंडारण या प्राप्ति की कोई तिथि नहीं — IS 1199 (Part 5):2018 धारा 6 का उल्लंघन।",
    type: "storage",
    critical: true,
  },
  {
    date: "15.04.2012",
    dateHi: "15.04.2012",
    label: "FSL Report issued — signed by KL Verma, SSO Physics",
    labelHi: "FSL रिपोर्ट जारी — KL वर्मा, SSO भौतिकी द्वारा हस्ताक्षरित",
    detail: "Report results: Packet A 1:18, Packet B 1:17, Packet C 1:5¾:9½. Report cites NO Indian Standard. No number of determinations stated. No repeatability data. No measurement uncertainty. No collection date. No receipt date. Control sample not supplied — 21% silica assumed. KL Verma's designation is SSO Physics — chemical analysis requires a chemistry qualification.",
    detailHi: "रिपोर्ट परिणाम: पैकेट A 1:18, पैकेट B 1:17, पैकेट C 1:5¾:9½। रिपोर्ट में कोई भारतीय मानक उद्धृत नहीं। निर्धारणों की संख्या नहीं। दोहरान डेटा नहीं। माप अनिश्चितता नहीं। संग्रह तिथि नहीं। प्राप्ति तिथि नहीं। नियंत्रण नमूना नहीं — 21% सिलिका मानी। KL वर्मा का पदनाम SSO भौतिकी — रासायनिक विश्लेषण रसायन योग्यता माँगता है।",
    type: "report",
    critical: true,
  },
];

const GAP_LABELS: { after: number; years: string; yearsHi: string; significance: string; significanceHi: string; color: string }[] = [
  {
    after: 1,
    years: "2.5 years of weathering",
    yearsHi: "2.5 वर्षों का मौसम प्रभाव",
    significance: "Each monsoon cycle carbonates the plaster surface (Ca(OH)₂ → CaCO₃) and introduces moisture into masonry joints. The 2010 inspection found no defect — the wall was structurally sound before ACB sampling.",
    significanceHi: "प्रत्येक मानसून चक्र प्लास्टर सतह को कार्बोनेट करता है और चिनाई जोड़ों में नमी डालता है। 2010 निरीक्षण में कोई दोष नहीं — दीवार ACB नमूना संग्रह से पहले संरचनात्मक रूप से मजबूत थी।",
    color: "bg-amber-100 border-amber-400 text-amber-800",
  },
  {
    after: 3,
    years: "6 months in cement bags",
    yearsHi: "6 माह सीमेंट के कट्टों में",
    significance: "Carbonation and moisture damage during uncontrolled storage. IS/IEC 17025:2017 Cl.7.4.3 mandates controlled storage. The FSL report states no storage conditions, no receipt date, no testing date.",
    significanceHi: "अनियंत्रित भंडारण के दौरान कार्बोनेशन और नमी क्षति। IS/IEC 17025:2017 धारा 7.4.3 नियंत्रित भंडारण अनिवार्य करती है। FSL रिपोर्ट में कोई भंडारण स्थिति, कोई प्राप्ति तिथि, कोई परीक्षण तिथि नहीं।",
    color: "bg-red-50 border-red-400 text-red-800",
  },
];

const TYPE_CONFIG = {
  construction: { dot: "bg-green-600", border: "border-green-600", badge: "bg-green-600", label: "CONSTRUCTION" },
  inspection: { dot: "bg-blue-600", border: "border-blue-600", badge: "bg-blue-600", label: "INSPECTION" },
  sampling: { dot: "bg-orange-500", border: "border-orange-500", badge: "bg-orange-500", label: "SAMPLING" },
  storage: { dot: "bg-red-600", border: "border-red-600", badge: "bg-red-600", label: "STORAGE" },
  report: { dot: "bg-[#18294F]", border: "border-[#18294F]", badge: "bg-[#18294F]", label: "REPORT" },
  gap: { dot: "bg-amber-500", border: "border-amber-500", badge: "bg-amber-500", label: "GAP" },
};

function ViolationBadge({ text }: { text: string }) {
  return (
    <span className="inline-block bg-red-100 border border-red-300 text-red-700 text-[9px] font-semibold px-1.5 py-0.5 rounded mr-1 mb-1">
      {text}
    </span>
  );
}

function GapBlock({ gap, lang }: { gap: typeof GAP_LABELS[number]; lang: Lang }) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  return (
    <div className={`mx-8 my-0 border-l-4 border-dashed rounded-r-lg px-4 py-3 ${gap.color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold">⟵ {showEn ? gap.years : ""}{lang === "both" ? " / " : ""}{showHi ? gap.yearsHi : ""} ⟶</span>
      </div>
      {showEn && <p className="text-[10px] leading-relaxed">{gap.significance}</p>}
      {lang === "both" && showHi && <p className="text-[10px] leading-relaxed italic mt-1 opacity-80">{gap.significanceHi}</p>}
      {lang === "hi" && <p className="text-[10px] leading-relaxed">{gap.significanceHi}</p>}
    </div>
  );
}

function TimelineEvent({ event, lang }: { event: Event; lang: Lang }) {
  const cfg = TYPE_CONFIG[event.type];
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  return (
    <div className="flex gap-4">
      {/* Left — date column */}
      <div className="w-28 shrink-0 text-right pt-1">
        <span className="text-[10px] font-bold text-[#18294F] leading-tight block">
          {showEn ? event.date : event.dateHi}
        </span>
      </div>

      {/* Centre — dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 ${cfg.dot} ${cfg.border} shrink-0 mt-1 z-10 shadow-sm`} />
        <div className="w-0.5 bg-[#B48C1E]/40 flex-1 mt-1" />
      </div>

      {/* Right — content */}
      <div className={`flex-1 pb-5 border rounded-lg px-3 py-2 mb-1 ${event.critical ? "border-red-300 bg-red-50/40" : "border-[#B48C1E]/30 bg-white"}`}>
        <div className="flex items-start gap-2 mb-1">
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0 ${cfg.badge}`}>
            {cfg.label}
          </span>
          {event.critical && (
            <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded shrink-0">CRITICAL</span>
          )}
        </div>
        <p className="text-xs font-semibold text-[#18294F] mb-1">
          {showEn ? event.label : event.labelHi}
          {lang === "both" && <span className="block font-normal text-[#18294F]/70 text-[10px] italic">{event.labelHi}</span>}
        </p>
        {showEn && <p className="text-[10px] leading-relaxed text-[#18294F]/80">{event.detail}</p>}
        {lang === "both" && <p className="text-[10px] leading-relaxed text-[#18294F]/60 italic mt-1">{event.detailHi}</p>}
        {lang === "hi" && <p className="text-[10px] leading-relaxed text-[#18294F]/80">{event.detailHi}</p>}
      </div>
    </div>
  );
}

export default function TimelinePage({ lang }: Props) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  const { constructionTimeline, sampleStorageConditions, insufficientSamplingQuantity, rahulEngineeringNABL } = replyFacts;

  return (
    <div className="font-serif text-[#18294F]">

      {/* HEADER */}
      <div className="bg-[#18294F] text-white rounded-lg px-6 py-4 mb-6 text-center">
        <p className="text-[#B48C1E] text-[10px] tracking-widest uppercase mb-1">Evidence Chronology</p>
        <h1 className="text-lg font-bold mb-1">
          {showEn ? "Timeline of Events — Construction to FSL Report" : ""}
          {lang === "both" && <span className="block text-sm font-normal text-white/70 mt-0.5">घटना क्रम — निर्माण से FSL रिपोर्ट तक</span>}
          {lang === "hi" ? "घटना क्रम — निर्माण से FSL रिपोर्ट तक" : ""}
        </h1>
        <p className="text-white/60 text-[10px]">
          {showEn ? "Total elapsed time: ~5 years from construction to FSL report. Each interval carries independent legal significance." : ""}
          {lang === "both" && " / "}
          {showHi ? "कुल बीता समय: निर्माण से FSL रिपोर्ट तक ~5 वर्ष। प्रत्येक अंतराल का स्वतंत्र विधिक महत्व है।" : ""}
        </p>
      </div>

      {/* LEGAL SIGNIFICANCE BANNER */}
      <div className="bg-[#B48C1E]/10 border border-[#B48C1E] rounded-lg px-4 py-3 mb-6 text-xs leading-relaxed text-[#18294F]">
        <span className="font-bold">Legal significance of the timeline: </span>
        {showEn ? constructionTimeline.legalSignificanceEn : ""}
        {lang === "both" && <span className="block italic text-[#18294F]/70 mt-1">{constructionTimeline.legalSignificanceHi}</span>}
        {lang === "hi" ? constructionTimeline.legalSignificanceHi : ""}
      </div>

      {/* TIMELINE */}
      <div className="mb-6 space-y-0">
        {EVENTS.map((ev, i) => (
          <div key={i}>
            <TimelineEvent event={ev} lang={lang} />
            {i === 1 && <GapBlock gap={GAP_LABELS[0]} lang={lang} />}
            {i === 3 && <GapBlock gap={GAP_LABELS[1]} lang={lang} />}
          </div>
        ))}
      </div>

      {/* VIOLATIONS SUMMARY */}
      <div className="border border-red-300 rounded-lg overflow-hidden mb-6">
        <div className="bg-red-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
          {showEn ? "Standards Violated by the Timeline Alone" : ""}
          {lang === "both" ? " / " : ""}
          {showHi ? "अकेले समयरेखा द्वारा उल्लंघित मानक" : ""}
        </div>
        <div className="px-4 py-3 bg-red-50 grid grid-cols-1 gap-2">
          {[
            { std: "IS 1199 (Part 5):2018, Cl.5", issue: "Sampling without contractor representative" },
            { std: "IS 1199 (Part 5):2018, Cl.5", issue: "Sampling in rain — prohibited" },
            { std: "IS 1199 (Part 5):2018, Cl.6", issue: "No collection date, receipt date, or testing date in FSL report" },
            { std: "IS 1199 (Part 5):2018", issue: "No referee sample retained for 90 days" },
            { std: "IS/IEC 17025:2017, Cl.7.4", issue: "No documented chain of custody from site to FSL" },
            { std: "IS/IEC 17025:2017, Cl.7.4.3", issue: "Samples stored in cement bags — not controlled conditions" },
            { std: "IS 4031 (Part 5):1988, Cl.4", issue: "Chemical analysis without control sample — result indicative only" },
            { std: "IS 516 (Part 1):2018, Cl.4", issue: "Tests conducted without notice to contractor" },
            { std: "NABL 160, Cl.5.10", issue: "No notification to either party before testing" },
          ].map((v, i) => (
            <div key={i} className="flex gap-2 text-[10px]">
              <span className="font-bold text-red-700 shrink-0">{v.std}</span>
              <span className="text-red-800">— {v.issue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SAMPLE REPRESENTATIVENESS TABLE */}
      <div className="border border-[#B48C1E] rounded-lg overflow-hidden mb-6">
        <div className="bg-[#18294F] text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
          {showEn ? "Sample Representativeness: Required vs Taken" : ""}
          {lang === "both" ? " / " : ""}
          {showHi ? "नमूना प्रतिनिधित्व: आवश्यक बनाम लिए गए" : ""}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#B48C1E]/10 text-[#18294F]">
              <tr>
                <th className="text-left px-3 py-2 border-b border-[#B48C1E]/30 font-semibold">Item</th>
                <th className="text-center px-3 py-2 border-b border-[#B48C1E]/30 font-semibold">Total Quantity</th>
                <th className="text-center px-3 py-2 border-b border-[#B48C1E]/30 font-semibold text-green-700">Required Samples</th>
                <th className="text-center px-3 py-2 border-b border-[#B48C1E]/30 font-semibold text-red-700">ACB Took</th>
              </tr>
            </thead>
            <tbody>
              {insufficientSamplingQuantity.workQuantities.map((r, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-[#B48C1E]/5" : ""}>
                  <td className="px-3 py-2">
                    {showEn ? r.item : r.itemHi}
                    {lang === "both" && <span className="text-[#18294F]/50 ml-1">({r.itemHi})</span>}
                  </td>
                  <td className="text-center px-3 py-2">{r.qty}</td>
                  <td className="text-center px-3 py-2 text-green-700 font-semibold">{r.required}</td>
                  <td className="text-center px-3 py-2 text-red-700 font-bold">{r.acbTook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-[#B48C1E]/5 text-[10px] text-[#18294F]/70 border-t border-[#B48C1E]/20 italic">
          {showEn ? `Source: ${insufficientSamplingQuantity.isStandard}` : ""}
          {lang === "both" ? " / " : ""}
          {showHi ? "IS 456:2000 धारा 15.2.2 पृष्ठ 29" : ""}
        </div>
      </div>

      {/* RAHUL ENGINEERING COUNTER-EVIDENCE */}
      <div className="border border-green-400 rounded-lg overflow-hidden mb-6">
        <div className="bg-green-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
          {showEn ? rahulEngineeringNABL.titleEn : rahulEngineeringNABL.titleHi}
        </div>
        <div className="px-4 py-3 bg-green-50 text-xs leading-relaxed text-green-900">
          {showEn ? rahulEngineeringNABL.enText : ""}
          {lang === "both" && <p className="italic text-green-800/70 mt-2">{rahulEngineeringNABL.hiText}</p>}
          {lang === "hi" ? rahulEngineeringNABL.hiText : ""}
        </div>
      </div>

      {/* COLOUR LEGEND */}
      <div className="border border-[#B48C1E]/40 rounded-lg px-4 py-3 mb-6">
        <p className="text-[10px] font-bold text-[#18294F] mb-2 uppercase tracking-wide">
          {showEn ? "Legend" : ""}
          {lang === "both" ? " / " : ""}
          {showHi ? "रंग कोड" : ""}
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_CONFIG).filter(([k]) => k !== "gap").map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px]">
              <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
              <span className="text-[#18294F]/70 capitalize">{cfg.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-[10px]">
            <div className="w-3 h-3 rounded-full bg-red-200 border border-red-500" />
            <span className="text-[#18294F]/70">Critical violation</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <div className="w-3 h-3 rounded border-2 border-dashed border-amber-500" />
            <span className="text-[#18294F]/70">Gap / Interval</span>
          </div>
        </div>
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
