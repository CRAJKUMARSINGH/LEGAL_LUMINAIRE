import { packetA, packetB, packetC, commonSection } from "../data/defenceData";
import type { Lang } from "../data/defenceData";

const PARA_NO = (() => { let n = 0; return () => ++n; })();
// Reset paragraph counter per render — we'll use a simple array approach instead

interface Props { lang: Lang; }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-bold text-[#18294F] border-b border-[#B48C1E] pb-1 mb-3 text-sm uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Para({ n, en, hi, lang }: { n: number; en: string; hi?: string; lang: Lang }) {
  return (
    <div className="mb-3 text-xs leading-relaxed text-[#18294F]">
      {(lang === "en" || lang === "both") && (
        <p><span className="font-semibold mr-1">{n}.</span>{en}</p>
      )}
      {lang === "both" && hi && <div className="h-1" />}
      {(lang === "hi" || lang === "both") && hi && (
        <p className={lang === "both" ? "text-[#18294F]/75 ml-4 italic" : ""}>
          {lang === "both" && <span className="font-semibold mr-1">{n}.</span>}{hi}
        </p>
      )}
    </div>
  );
}

function GroundBlock({
  num, titleEn, titleHi, bodyEn, bodyHi, stdEn, stdHi, critical, lang, paraRef
}: {
  num: string; titleEn: string; titleHi: string; bodyEn: string; bodyHi: string;
  stdEn: string; stdHi?: string; critical: boolean; lang: Lang; paraRef: number;
}) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  return (
    <div className={`mb-4 border-l-2 pl-3 ${critical ? "border-red-500" : "border-[#B48C1E]"}`}>
      <p className="text-xs font-bold text-[#18294F] mb-1">
        <span className="mr-1">{paraRef}.</span>
        {showEn && <span>{titleEn}{critical ? " [CRITICAL]" : ""}</span>}
        {lang === "both" && <span className="font-normal text-[#18294F]/70 ml-2">/ {titleHi}</span>}
        {lang === "hi" && <span>{titleHi}</span>}
      </p>
      {showEn && <p className="text-xs leading-relaxed text-[#18294F]/90 mb-1">{bodyEn}</p>}
      {showHi && <p className={`text-xs leading-relaxed mb-1 ${lang === "both" ? "text-[#18294F]/70 italic" : "text-[#18294F]/90"}`}>{bodyHi}</p>}
      {stdEn && (
        <div className="bg-[#B48C1E]/8 border border-[#B48C1E]/30 rounded px-2 py-1 mt-1">
          <p className="text-[10px] text-[#18294F]/80 leading-relaxed">
            <span className="font-semibold text-[#B48C1E]">Standards: </span>
            {showEn ? stdEn : ""}
            {lang === "both" && stdHi && <span className="block italic mt-0.5 text-[#18294F]/60">{stdHi}</span>}
            {lang === "hi" && stdHi && stdHi}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MotionPage({ lang }: Props) {
  const showEn = lang === "en" || lang === "both";
  const showHi = lang === "hi" || lang === "both";
  const bi = lang === "both";

  // Sequential paragraph numbers across the entire document
  let p = 0;
  const P = () => ++p;

  return (
    <div className="font-serif text-[#18294F] text-xs">

      {/* COURT HEADER */}
      <div className="print:shadow-none border border-[#B48C1E] rounded-lg overflow-hidden mb-6">
        <div className="bg-[#18294F] text-white px-6 py-5 text-center">
          <p className="text-[#B48C1E] text-[10px] tracking-widest uppercase mb-2">
            {showEn ? "Before the Competent Authority / Enquiry Officer" : ""}
            {bi && " / "}
            {showHi ? "सक्षम प्राधिकरण / जाँच अधिकारी के समक्ष" : ""}
          </p>
          <p className="text-white/70 text-[10px] mb-3">
            {showEn ? "In the matter of: Department of Youth Affairs & Sports, Rajasthan — Construction Works — Cricket Stadium, Maharana Pratap Khelagaon, Chitrakoot Nagar, Bhiwana (2007–08)" : ""}
            {bi && <br />}
            {showHi ? "विषय: युवा मामले एवं खेल विभाग, राजस्थान — निर्माण कार्य — क्रिकेट स्टेडियम, महाराणा प्रताप खेलागाँव, चित्रकूट नगर, भीवाना (2007–08)" : ""}
          </p>
          <h1 className="text-lg font-bold tracking-wide mb-1">
            {showEn ? "WRITTEN OBJECTIONS TO FSL REPORT DATED 15.04.2012" : ""}
            {bi && <br />}
            {showHi ? "FSL रिपोर्ट दिनांक 15.04.2012 के विरुद्ध लिखित आपत्तियाँ" : ""}
          </h1>
          <p className="text-white/70 text-[10px] mt-2">
            {showEn ? "Filed by: Hemraj (Contractor) — through his authorised representative" : ""}
            {bi && " / "}
            {showHi ? "प्रस्तुतकर्ता: हेमराज (ठेकेदार) — अपने अधिकृत प्रतिनिधि के माध्यम से" : ""}
          </p>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* PART I — PRELIMINARY STATEMENT */}
          <Section title={showEn ? "Part I — Preliminary Statement of Facts" : "भाग I — प्रारंभिक तथ्य कथन"}>
            <Para n={P()} lang={lang}
              en="The contractor Hemraj was engaged for construction work at the Cricket Stadium, Maharana Pratap Khelagaon, Chitrakoot Nagar, Bhiwana during the period 2007–08. The relevant construction was completed in 2007–08. The FSL report challenged herein purports to examine three samples designated Packet A (cement plaster), Packet B (masonry mortar), and Packet C (foundation concrete) and assigns ratios of 1:18, 1:17, and 1:5.75:9.5 respectively."
              hi="ठेकेदार हेमराज को 2007–08 में क्रिकेट स्टेडियम, महाराणा प्रताप खेलागाँव, चित्रकूट नगर, भीवाना में निर्माण कार्य हेतु नियुक्त किया गया था। सम्बंधित निर्माण 2007–08 में पूर्ण किया गया। विवादित FSL रिपोर्ट पैकेट A (सीमेंट प्लास्टर), पैकेट B (चिनाई मसाला), और पैकेट C (नींव का कंक्रीट) तीन नमूनों की जाँच का दावा करती है और क्रमशः 1:18, 1:17 और 1:5.75:9.5 के अनुपात निर्दिष्ट करती है।"
            />
            <Para n={P()} lang={lang}
              en="The samples were collected on a stormy, rainy day in 2011 — approximately three to four years after construction was completed. The site conditions at the time of sampling included waterlogged ground with approximately two feet of standing water. The FSL report is dated 15.04.2012."
              hi="नमूने वर्ष 2011 में एक तूफानी, वर्षा वाले दिन एकत्रित किए गए — निर्माण पूर्ण होने के लगभग तीन-चार वर्ष बाद। नमूना संग्रह के समय स्थल पर लगभग दो फुट खड़ा पानी था। FSL रिपोर्ट दिनांक 15.04.2012 है।"
            />
            <Para n={P()} lang={lang}
              en="The G-Schedule specifications for the work confirm: Packet A (plaster) — specified as CM 1:6, and the FSL result matches CM 1:6 for Mark-A; Packet B (masonry mortar) — specified as CM 1:4, FSL result 1:17 is wholly discrepant; Packet C (foundation concrete) — specified as PCC 1:4:8, FSL result 1:5.75:9.5 is discrepant. In particular the FSL result for Packet A (1:18) is far outside even the specified ratio of 1:6."
              hi="कार्य हेतु G-अनुसूची विनिर्देश पुष्टि करते हैं: पैकेट A (प्लास्टर) — CM 1:6 निर्धारित; पैकेट B (चिनाई मसाला) — CM 1:4 निर्धारित, FSL परिणाम 1:17 पूर्णतः विसंगत; पैकेट C (नींव कंक्रीट) — PCC 1:4:8 निर्धारित, FSL परिणाम 1:5.75:9.5 विसंगत। पैकेट A का FSL परिणाम (1:18) निर्धारित 1:6 अनुपात से भी बहुत अधिक दूर है।"
            />
            <Para n={P()} lang={lang}
              en="The contractor submits that the FSL report is vitiated on multiple independent grounds — procedural, scientific, and legal. Any single ground stated herein would be sufficient to exclude or substantially discount the evidence. Together, they render the report incapable of serving as the basis for any adverse order."
              hi="ठेकेदार प्रस्तुत करता है कि FSL रिपोर्ट अनेक स्वतंत्र आधारों पर — प्रक्रियागत, वैज्ञानिक और विधिक — दूषित है। यहाँ वर्णित कोई भी एकल आधार साक्ष्य को बाहर करने या पर्याप्त रूप से कम करने के लिए पर्याप्त होगा। संयुक्त रूप से, वे रिपोर्ट को किसी भी प्रतिकूल आदेश के आधार के रूप में काम करने में असमर्थ बनाते हैं।"
            />
          </Section>

          {/* PART II — NINE PROCEDURAL GROUNDS */}
          <Section title={showEn ? "Part II — Nine Procedural Grounds (Applicable to All Three Packets)" : "भाग II — नौ प्रक्रियागत आधार (तीनों पैकेटों पर लागू)"}>
            <Para n={P()} lang={lang}
              en="The following nine grounds of procedural violation apply with equal force to all three samples. For Packets B and C, where the ground is identical, it is relied upon by reference to the statement below."
              hi="निम्नलिखित नौ प्रक्रियागत उल्लंघन के आधार तीनों नमूनों पर समान बल के साथ लागू होते हैं।"
            />

            {packetA.grounds.map((g) => (
              <GroundBlock key={g.number}
                num={`Ground ${g.number}`}
                titleEn={g.titleEn.replace(/ \[CRITICAL\]$/, "")}
                titleHi={g.titleHi.replace(/ \[अत्यंत महत्वपूर्ण\]$/, "")}
                bodyEn={g.defenceEn}
                bodyHi={g.defenceHi}
                stdEn={g.standardsEn}
                stdHi={g.standardsHi}
                critical={g.critical}
                lang={lang}
                paraRef={P()}
              />
            ))}
          </Section>

          {/* PART III — PACKET A */}
          <Section title={showEn ? "Part III — Packet A: Cement Plaster — Additional Scientific Challenges" : "भाग III — पैकेट A: सीमेंट प्लास्टर — अतिरिक्त वैज्ञानिक चुनौतियाँ"}>
            <Para n={P()} lang={lang}
              en={`FSL result for Packet A: Cement : Sand = 1:18. Applicable standard: ${packetA.info.applicableStd.en}. The FSL result of 1:18 is 300–450% above the sand content of the leanest standard grade. The standing boundary wall itself disproves this ratio.`}
              hi={`पैकेट A का FSL परिणाम: सीमेंट : रेत = 1:18। लागू मानक: ${packetA.info.applicableStd.hi}। FSL का 1:18 का परिणाम मानक श्रेणी से 300–450% अधिक रेत दर्शाता है। खड़ी सीमा दीवार स्वयं इस अनुपात को असंभव सिद्ध करती है।`}
            />
            {packetA.challenges.map((c) => (
              <GroundBlock key={c.id}
                num={c.id}
                titleEn={c.titleEn}
                titleHi={c.titleHi}
                bodyEn={c.bodyEn}
                bodyHi={c.bodyHi}
                stdEn={c.standardsEn || ""}
                stdHi={c.standardsHi}
                critical={c.critical}
                lang={lang}
                paraRef={P()}
              />
            ))}
          </Section>

          {/* PART IV — PACKET B */}
          <Section title={showEn ? "Part IV — Packet B: Stone Masonry Mortar — Additional Scientific Challenges" : "भाग IV — पैकेट B: पत्थर चिनाई मसाला — अतिरिक्त वैज्ञानिक चुनौतियाँ"}>
            <Para n={P()} lang={lang}
              en={`FSL result for Packet B: Cement : Sand = 1:17. Applicable standard: ${packetB.info.applicableStd.en}. No recognised masonry mortar grade exists at or near 1:17. A wall bonded with 1:17 mortar could not stand.`}
              hi={`पैकेट B का FSL परिणाम: सीमेंट : रेत = 1:17। लागू मानक: ${packetB.info.applicableStd.hi}। 1:17 के आसपास कोई मान्यता प्राप्त चिनाई मसाला ग्रेड नहीं। 1:17 मसाले से बनी दीवार खड़ी नहीं रह सकती।`}
            />
            <Para n={P()} lang={lang}
              en="In addition to all nine procedural grounds, the following specific scientific challenges apply to Packet B:"
              hi="नौ प्रक्रियागत आधारों के अतिरिक्त, निम्नलिखित विशिष्ट वैज्ञानिक चुनौतियाँ पैकेट B पर लागू हैं:"
            />
            {packetB.challenges.map((c) => (
              <GroundBlock key={c.id}
                num={c.id}
                titleEn={c.titleEn}
                titleHi={c.titleHi}
                bodyEn={c.bodyEn}
                bodyHi={c.bodyHi}
                stdEn={c.standardsEn || ""}
                stdHi={c.standardsHi}
                critical={c.critical}
                lang={lang}
                paraRef={P()}
              />
            ))}
          </Section>

          {/* PART V — PACKET C */}
          <Section title={showEn ? "Part V — Packet C: Foundation Concrete — Additional Scientific Challenges" : "भाग V — पैकेट C: नींव का कंक्रीट — अतिरिक्त वैज्ञानिक चुनौतियाँ"}>
            <Para n={P()} lang={lang}
              en={`FSL result for Packet C: Cement : Sand : Grit = 1:5.75:9.5. Applicable standard: ${packetC.info.applicableStd.en}. IS 4031 (Part 5) is a cement testing standard — NOT a concrete analysis standard. The FSL applied the fundamentally wrong method.`}
              hi={`पैकेट C का FSL परिणाम: सीमेंट : रेत : गिट्टी = 1:5.75:9.5। लागू मानक: ${packetC.info.applicableStd.hi}। IS 4031 (भाग 5) सीमेंट परीक्षण मानक है — कंक्रीट विश्लेषण मानक नहीं। FSL ने मूलतः गलत विधि लागू की।`}
            />
            {packetC.challenges.map((c) => (
              <GroundBlock key={c.id}
                num={c.id}
                titleEn={c.titleEn}
                titleHi={c.titleHi}
                bodyEn={c.bodyEn}
                bodyHi={c.bodyHi}
                stdEn={c.standardsEn || ""}
                stdHi={c.standardsHi}
                critical={c.critical}
                lang={lang}
                paraRef={P()}
              />
            ))}
          </Section>

          {/* PART VI — COMMON GROUND: 21% SILICA */}
          <Section title={showEn ? "Part VI — Common Ground: The Unverified 21% Silica Assumption" : "भाग VI — सामान्य आधार: 21% सिलिका की अप्रमाणित मान्यता"}>
            <Para n={P()} lang={lang}
              en={`The FSL report explicitly states: "As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica." This single admission undermines the quantitative basis of all three results simultaneously and constitutes an independent ground for discounting all three reported ratios.`}
              hi={`FSL रिपोर्ट में स्पष्ट रूप से कहा गया है: "नियंत्रण नमूना नहीं मिला, इसलिए यह मानकर कि उत्तम गुणवत्ता के सीमेंट में 21% घुलनशील सिलिका होती है, अनुपात की गणना की गई।" FSL रिपोर्ट में यह एकल स्वीकृति एक साथ तीनों परिणामों की मात्रात्मक आधार को कमजोर करती है।`}
            />
            <Para n={P()} lang={lang}
              en="IS 269:2015 (Ordinary Portland Cement) specifies only a minimum of 17% SiO₂ with no fixed upper limit. Actual variation: approximately 19–24%. The FSL's assumed value of 21% has no prescribed basis under any Indian Standard."
              hi="IS 269:2015 (साधारण पोर्टलैंड सीमेंट) केवल न्यूनतम 17% SiO₂ निर्दिष्ट करता है, कोई निश्चित ऊपरी सीमा नहीं। वास्तविक भिन्नता: लगभग 19–24%। FSL की 21% मान्यता किसी भारतीय मानक द्वारा निर्धारित नहीं है।"
            />
            <Para n={P()} lang={lang}
              en="A 2% underestimation of true cement silica (21% assumed vs. 23% actual) shifts the calculated cement:sand ratio by approximately 10%, potentially converting a compliant 1:6 to an apparent 1:6.6. With the compounding effects of carbonation (Packet A), stone contamination (Packet B), and wrong method (Packet C), small errors in the silica assumption produce large errors in the calculated ratio."
              hi="वास्तविक सीमेंट सिलिका का 2% कम अनुमान (21% माना बनाम 23% वास्तविक) गणना किए गए अनुपात को लगभग 10% बदलता है। कार्बोनेशन (A), पत्थर संदूषण (B) और गलत विधि (C) के संयुक्त प्रभावों के साथ, सिलिका धारणा में छोटी त्रुटियाँ बड़ी त्रुटियाँ उत्पन्न करती हैं।"
            />
            <Para n={P()} lang={lang}
              en={`IS 4031 (Part 5):1988 Clause 4 mandates a verified cement control sample for chemical analysis. Where unavailable, the result "shall be accompanied by a statement that it is indicative only." The FSL report does not include this mandatory qualification — the reported ratios are therefore, at best, indicative and cannot be treated as conclusive proof.`}
              hi={`IS 4031 (Part 5):1988 धारा 4 रासायनिक विश्लेषण के लिए सत्यापित सीमेंट नियंत्रण नमूना अनिवार्य करती है। जहाँ अनुपलब्ध हो, परिणाम के साथ यह कथन अनिवार्य: "यह केवल संकेतात्मक है।" FSL रिपोर्ट में यह अनिवार्य अर्हता नहीं है — रिपोर्ट के अनुपात अधिकतम संकेतात्मक हैं, निर्णायक नहीं।`}
            />
          </Section>

          {/* PART VII — LEGAL SUBMISSIONS */}
          <Section title={showEn ? "Part VII — Legal Submissions" : "भाग VII — विधिक प्रस्तुतियाँ"}>
            <Para n={P()} lang={lang}
              en="The collection of samples without notice to or in the presence of the contractor's authorised representative violates the principle of Audi Alteram Partem guaranteed under Articles 14 and 21 of the Constitution of India. Maneka Gandhi v. Union of India (1978) 1 SCC 248 establishes that no adverse order may be founded on evidence generated in a proceeding from which the affected party was excluded. State of W.B. v. Binapani Dei, AIR 1967 SC 1269 confirms that a quasi-judicial authority must afford a fair hearing before passing adverse orders."
              hi="ठेकेदार के अधिकृत प्रतिनिधि को बिना सूचना दिये और उनकी उपस्थिति के बिना नमूने एकत्रित करना भारतीय संविधान के अनुच्छेद 14 और 21 के अन्तर्गत गारंटीकृत Audi Alteram Partem के सिद्धांत का उल्लंघन है। मेनका गांधी बनाम भारत संघ (1978) 1 SCC 248 स्थापित करता है कि किसी कार्यवाही में जिस पक्ष को बाहर किया गया हो, उसके विरुद्ध उस कार्यवाही में उत्पन्न साक्ष्य के आधार पर कोई प्रतिकूल आदेश पारित नहीं किया जा सकता।"
            />
            <Para n={P()} lang={lang}
              en="The failure to maintain a documented chain of custody for the samples from the site to the FSL constitutes a fatal procedural defect. Mohd. Khalid v. State of W.B. (2002) 7 SCC 334 holds that gaps in the chain of custody create reasonable doubt in favour of the respondent. The test was conducted without notice to the contractor — in violation of IS 516 (Part 1):2018 Clause 4 and NABL 160 Clause 5.10. Union of India v. Tulsiram Patel (1985) 3 SCC 398 holds that the charged party must have a genuine opportunity to meet the case against them at every material stage."
              hi="नमूनों की अभिरक्षा श्रृंखला का दस्तावेजीकरण न होना एक घातक प्रक्रियागत दोष है। मो. खालिद बनाम पश्चिम बंगाल राज्य (2002) 7 SCC 334 में माना गया है कि अभिरक्षा श्रृंखला में अंतराल प्रतिवादी के पक्ष में उचित संदेह उत्पन्न करता है। IS 516 (Part 1):2018 धारा 4 और NABL 160 धारा 5.10 के उल्लंघन में परीक्षण बिना सूचना के किया गया।"
            />
            <Para n={P()} lang={lang}
              en="The FSL report cites no Indian Standard for the method of analysis. State of H.P. v. Jai Lal (1999) 7 SCC 280 holds that an expert report must state the methodology, tests conducted, and the standard used — silence on methodology is not conclusive proof. IS/IEC 17025:2017 Clause 7.8.2 makes citation of the test method a mandatory minimum in every test report. Siemens Engineering v. Union of India (1976) 2 SCC 981 confirms the duty to give reasons in quasi-judicial proceedings."
              hi="FSL रिपोर्ट विश्लेषण की विधि के लिए कोई भारतीय मानक उद्धृत नहीं करती। राज्य हिप्र बनाम जय लाल (1999) 7 SCC 280 में माना गया है कि विशेषज्ञ रिपोर्ट में पद्धति, किए गए परीक्षण और प्रयुक्त मानक का उल्लेख होना चाहिए। IS/IEC 17025:2017 धारा 7.8.2 प्रत्येक परीक्षण रिपोर्ट में परीक्षण विधि उद्धरण को अनिवार्य न्यूनतम बनाती है।"
            />
            <Para n={P()} lang={lang}
              en="No referee sample was retained by the FSL for a minimum of 90 days as required by IS 1199 (Part 5):2018. This destroys the contractor's right to independent counter-testing. Section 114 Illustration (g) of the Indian Evidence Act 1872 empowers the court to presume that evidence which could be produced but is not produced would, if produced, be unfavourable to the person who withholds it. Tomaso Bruno v. State of U.P. (2015) 7 SCC 178 confirms that failure to preserve best available evidence attracts adverse inference."
              hi="IS 1199 (Part 5):2018 के अनुसार न्यूनतम 90 दिनों के लिए FSL द्वारा कोई रेफरी नमूना नहीं रखा गया। यह ठेकेदार के स्वतंत्र प्रति-परीक्षण के अधिकार को नष्ट करता है। भारतीय साक्ष्य अधिनियम 1872 की धारा 114 दृष्टांत (ग) के अन्तर्गत न्यायालय यह उपधारणा कर सकता है कि जो साक्ष्य उत्पन्न किया जा सकता था लेकिन नहीं किया गया, यदि उत्पन्न किया जाता तो उसे रोकने वाले व्यक्ति के विरुद्ध प्रतिकूल होता।"
            />
          </Section>

          {/* PART VIII — PRAYER */}
          <Section title={showEn ? "Part VIII — Prayer" : "भाग VIII — प्रार्थना"}>
            <div className="bg-[#18294F]/5 border border-[#B48C1E] rounded-lg px-4 py-4">
              {showEn && (
                <div className="mb-3">
                  <p className="font-semibold text-[#18294F] mb-2">It is most respectfully prayed that:</p>
                  <ol className="space-y-2 list-none">
                    <li className="flex gap-2"><span className="font-bold shrink-0">1.</span><span>The FSL results for Packets A, B, and C be excluded from consideration, or be accorded no probative weight, on the ground that they were generated in violation of every applicable Indian Standard for sampling, chain of custody, testing, and reporting.</span></li>
                    <li className="flex gap-2"><span className="font-bold shrink-0">2.</span><span>In the alternative, a fresh test be directed: (a) with at least 48 hours' advance notice to the contractor; (b) with the contractor's representative present at sampling and testing; (c) by the correct method for each material (IS 1661/IS 516 for plaster, IS 2250 for mortar, IS 516 Part 5:2020 core drilling for concrete); (d) with a verified cement control sample and the actual aggregate samples used in the original construction.</span></li>
                    <li className="flex gap-2"><span className="font-bold shrink-0">3.</span><span>The contractor be held entitled to provide the cement batch records, aggregate quality certificates, and any mix design documentation in further evidence.</span></li>
                    <li className="flex gap-2"><span className="font-bold shrink-0">4.</span><span>No adverse order be passed on the basis of the existing FSL report dated 15.04.2012.</span></li>
                  </ol>
                </div>
              )}
              {showHi && (
                <div className={bi ? "border-t border-[#B48C1E]/30 pt-3 text-[#18294F]/80 italic" : ""}>
                  <p className="font-semibold text-[#18294F] mb-2">अत्यंत सादर निवेदन है कि:</p>
                  <ol className="space-y-2 list-none">
                    <li className="flex gap-2"><span className="font-bold shrink-0">1.</span><span>पैकेट A, B और C के FSL परिणामों को विचार से बाहर किया जाए, या कोई प्रमाणिक भार न दिया जाए।</span></li>
                    <li className="flex gap-2"><span className="font-bold shrink-0">2.</span><span>वैकल्पिक रूप से, एक नया परीक्षण निर्देशित किया जाए: (क) कम से कम 48 घंटे की अग्रिम सूचना; (ख) ठेकेदार के प्रतिनिधि की उपस्थिति; (ग) प्रत्येक सामग्री की सही विधि; (घ) सत्यापित सीमेंट नियंत्रण नमूने के साथ।</span></li>
                    <li className="flex gap-2"><span className="font-bold shrink-0">3.</span><span>ठेकेदार को सीमेंट बैच रिकॉर्ड, समुच्चय गुणवत्ता प्रमाणपत्र और मिश्रण डिजाइन दस्तावेज प्रदान करने का अधिकार दिया जाए।</span></li>
                    <li className="flex gap-2"><span className="font-bold shrink-0">4.</span><span>मौजूदा FSL रिपोर्ट दिनांक 15.04.2012 के आधार पर कोई प्रतिकूल आदेश पारित न किया जाए।</span></li>
                  </ol>
                </div>
              )}
            </div>
          </Section>

          {/* VERIFICATION */}
          <Section title={showEn ? "Verification" : "सत्यापन"}>
            <div className="border border-[#B48C1E]/40 rounded px-4 py-3 text-xs">
              {showEn && (
                <p>I, <span className="font-semibold">Hemraj</span>, the above-named contractor, do hereby verify that the contents of paragraphs 1 to {p} of these Written Objections are true and correct to the best of my knowledge, belief, and information, and nothing material has been concealed therefrom. Signed this ______ day of _____________, 20___.</p>
              )}
              {bi && <div className="h-2" />}
              {showHi && (
                <p className={bi ? "italic text-[#18294F]/70" : ""}>मैं, <span className="font-semibold">हेमराज</span>, उपरोक्त नामित ठेकेदार, एतद्द्वारा सत्यापित करता हूँ कि इन लिखित आपत्तियों के अनुच्छेद 1 से {p} तक की सामग्री मेरी जानकारी, विश्वास और सूचना के अनुसार सत्य एवं सही है और इसमें से कोई भी महत्वपूर्ण बात नहीं छुपाई गई है। दिनांक ______, माह _____________, 20___।</p>
              )}
              <div className="flex justify-end mt-4 gap-16 text-xs">
                <div className="text-center">
                  <div className="border-t border-[#18294F]/40 pt-1 mt-4 w-36">
                    {showEn ? "Signature of Contractor" : "ठेकेदार के हस्ताक्षर"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-[#18294F]/40 pt-1 mt-4 w-36">
                    {showEn ? "Place & Date" : "स्थान एवं दिनांक"}
                  </div>
                </div>
              </div>
            </div>
          </Section>

        </div>
      </div>

      {/* PRINT BUTTON */}
      <div className="no-print text-center mb-6">
        <button
          onClick={() => window.print()}
          className="bg-[#18294F] text-white px-8 py-2 rounded text-sm font-semibold hover:bg-[#1e3566] transition-colors mr-3"
        >
          Print / Save as PDF
        </button>
        <span className="text-xs text-[#18294F]/50">
          {showEn ? "Use landscape orientation for best results." : ""}
          {bi && " / "}
          {showHi ? "सर्वोत्तम परिणाम के लिए लैंडस्केप उन्मुखीकरण उपयोग करें।" : ""}
        </span>
      </div>
    </div>
  );
}
