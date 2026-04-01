import { ExternalLink, Scale, BookOpen, Globe } from "lucide-react";

const cases = [
  {
    name: "कट्टावेल्लई @ देवकर बनाम तमिलनाडु राज्य",
    citation: "2025 INSC 845 | Cri. Appeal No. 1672/2019",
    court: "सर्वोच्च न्यायालय — त्रि-न्यायाधीशीय खण्डपीठ",
    date: "15 जुलाई 2025",
    relevance: "अत्यन्त उच्च — प्रत्यक्ष बाध्यकारी",
    holding: "श्रृंखला-अभिरक्षा पंजिका बिना फोरेंसिक साक्ष्य अग्राह्य। \"Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained.\"",
    application: "मोर्टार नमूनों की शून्य श्रृंखला-अभिरक्षा → सम्पूर्ण फोरेंसिक रिपोर्ट अग्राह्य",
    badge: "binding",
  },
  {
    name: "उत्तराखण्ड उच्च न्यायालय — श्रृंखला-अभिरक्षा निर्णय",
    citation: "2026 — LiveLaw Report",
    court: "उत्तराखण्ड उच्च न्यायालय",
    date: "मार्च 2026",
    relevance: "उच्च — उच्च न्यायालय निर्णय",
    holding: "\"In the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive.\"",
    application: "शून्य श्रृंखला-अभिरक्षा → फोरेंसिक साक्ष्य निष्फल",
    badge: "high",
  },
  {
    name: "पंचनामा अग्राह्यता — सर्वोच्च न्यायालय",
    citation: "2026 — BWLegalWorld Report",
    court: "सर्वोच्च न्यायालय",
    date: "2026",
    relevance: "उच्च — पंचनामा की अनिवार्यता",
    holding: "\"Panchanamas would be inadmissible in court if they were prepared in a manner violating Section 162 CrPC.\"",
    application: "नमूना-संग्रह पंचनामे का अभाव → सम्पूर्ण प्रक्रिया अमान्य",
    badge: "high",
  },
  {
    name: "Union of India v. Prafulla Kumar Samal",
    citation: "(1979) 3 SCC 4",
    court: "सर्वोच्च न्यायालय",
    date: "1979",
    relevance: "उच्च — उन्मोचन का मानदण्ड",
    holding: "\"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged.\"",
    application: "दोषपूर्ण साक्ष्य = केवल सन्देह → उन्मोचन अनिवार्य",
    badge: "binding",
  },
  {
    name: "State of Bihar v. Ramesh Singh",
    citation: "(1977) 4 SCC 39",
    court: "सर्वोच्च न्यायालय",
    date: "1977",
    relevance: "उच्च — उन्मोचन परीक्षण",
    holding: "उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं। यदि नहीं, तो उन्मोचन अनिवार्य है।",
    application: "फोरेंसिक साक्ष्य दूषित → प्रथम दृष्टया आरोप असिद्ध → उन्मोचन",
    badge: "binding",
  },
  {
    name: "Jacob Mathew v. State of Punjab",
    citation: "(2005) 6 SCC 1",
    court: "सर्वोच्च न्यायालय",
    date: "2005",
    relevance: "माध्यम — लापरवाही की परिभाषा",
    holding: "\"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act.\" — 304A IPC के अंतर्गत आपराधिक उपेक्षा के लिए 'घोर लापरवाही' आवश्यक।",
    application: "प्राकृतिक आपदा = Force Majeure → घोर उपेक्षा का आरोप असिद्ध",
    badge: "moderate",
  },
  {
    name: "मद्रास उच्च न्यायालय — फोरेंसिक परीक्षण अधिकार",
    citation: "31 जुलाई 2025 — SCCOnline",
    court: "मद्रास उच्च न्यायालय",
    date: "जुलाई 2025",
    relevance: "उच्च — प्रतिनिधि का अधिकार",
    holding: "\"The accused is entitled to a fair opportunity to disprove the allegations against him. Denial of access to forensic examination amounts to curtailment of such a right.\"",
    application: "ठेकेदार प्रतिनिधि अनुपस्थित → नैसर्गिक न्याय का हनन",
    badge: "high",
  },
  {
    name: "मालेगाँव विस्फोट बरी — NIA विशेष न्यायालय",
    citation: "2025 — Indian Express",
    court: "NIA विशेष न्यायालय, मुम्बई",
    date: "2025",
    relevance: "माध्यम — अविश्वसनीय साक्ष्य",
    holding: "\"The prosecution failed to provide cogent and reliable evidence, and also failed to establish guilt beyond reasonable doubt.\"",
    application: "अविश्वसनीय फोरेंसिक साक्ष्य → संदेह का लाभ अभियुक्त को",
    badge: "moderate",
  },
];

const standards = [
  {
    code: "IS 1199:2018",
    title: "कंक्रीट नमूनाकरण एवं विश्लेषण",
    clauses: "धारा 4.1, 4.4, 6.2",
    violation: "वर्षा में नमूना संग्रह — मौसम-सुरक्षा उल्लंघन",
    source: "BIS / Archive.org",
  },
  {
    code: "IS 4031 (भाग 1-15)",
    title: "हाइड्रोलिक सीमेंट भौतिक परीक्षण",
    clauses: "भाग 1 : नमूना तैयारी, भाग 6 : संपीड़न शक्ति",
    violation: "27±2°C तापमान नियंत्रण असम्भव — वर्षाकालीन संग्रह",
    source: "Scribd / BIS Portal",
  },
  {
    code: "IS 3535:1986",
    title: "हाइड्रोलिक सीमेंट नमूनाकरण",
    clauses: "धारा 4.1, 5.1, 6.2",
    violation: "ठेकेदार प्रतिनिधि की अनुपस्थिति — व्यवस्थित नमूनाकरण का अभाव",
    source: "Archive.org / BIS",
  },
  {
    code: "ASTM C780",
    title: "मोर्टार नमूनाकरण पद्धति",
    clauses: "धारा 5.2, 6.1",
    violation: "सतह संदूषण निराकरण नहीं — मौसम-सुरक्षा नहीं",
    source: "Scribd / ASTM",
  },
  {
    code: "BS EN 1015-2",
    title: "मोर्टार परीक्षण पद्धतियाँ",
    clauses: "धारा 4.3.1, 5.1.2",
    violation: "बाहरी कार्बोनेटेड परत नहीं हटाई — आंतरिक सार से नमूना नहीं",
    source: "BSI / CEN",
  },
  {
    code: "CPWD मैनुअल 2023",
    title: "केन्द्रीय लोक निर्माण विभाग नियमावली",
    clauses: "खण्ड 3.7.4, 12.2.1",
    violation: "फोरेंसिक नमूनाकरण में ठेकेदार की उपस्थिति अनिवार्य — उल्लंघन",
    source: "CPWD Official",
  },
  {
    code: "NBC 2016/2023",
    title: "राष्ट्रीय भवन संहिता",
    clauses: "खण्ड 3.4, परिशिष्ट C",
    violation: "अत्यधिक वर्षा = Force Majeure — ठेकेदार की देयता से छूट",
    source: "BIS NBC",
  },
];

const badgeColor: Record<string, string> = {
  binding: "bg-green-100 text-green-800",
  high: "bg-blue-100 text-blue-800",
  moderate: "bg-yellow-100 text-yellow-800",
};
const badgeLabel: Record<string, string> = {
  binding: "बाध्यकारी",
  high: "उच्च महत्त्व",
  moderate: "सहायक",
};

export default function CaseResearch() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">विधिक शोध</h1>
        <p className="text-sm text-muted-foreground">Legal Research — Cases & Standards</p>
      </div>

      <div>
        <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          न्यायिक निर्णय
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Judicial Precedents — Supreme Court & High Courts</p>
        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.citation}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${badgeColor[c.badge]}`}>
                  {badgeLabel[c.badge]}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
                <div>
                  <span className="text-muted-foreground font-medium">न्यायालय:</span>
                  <span className="ml-1 text-foreground">{c.court}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">दिनांक:</span>
                  <span className="ml-1 text-foreground">{c.date}</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-foreground mb-1">मुख्य अभिधारण:</p>
                <p className="text-xs text-foreground/80 leading-relaxed italic">{c.holding}</p>
              </div>
              <div className="mt-2 p-3 bg-accent/30 rounded-lg">
                <p className="text-xs font-medium text-accent-foreground mb-1">प्रस्तुत प्रकरण में प्रयोग:</p>
                <p className="text-xs text-accent-foreground/80">{c.application}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          भारतीय एवं अंतर्राष्ट्रीय मानक
        </h2>
        <p className="text-xs text-muted-foreground mb-4">IS Codes & International Standards Violated</p>
        <div className="space-y-3">
          {standards.map((s) => (
            <div key={s.code} className="bg-card border border-border rounded-xl p-4 flex gap-4">
              <div className="w-28 flex-shrink-0">
                <span className="text-xs font-bold text-primary bg-accent px-2 py-1 rounded-md block text-center">
                  {s.code}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">प्रासंगिक धाराएँ: {s.clauses}</p>
                <p className="text-xs mt-2 text-red-700 bg-red-50 px-2 py-1 rounded">
                  उल्लंघन: {s.violation}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> स्रोत: {s.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
