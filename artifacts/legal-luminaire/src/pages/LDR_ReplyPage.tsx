import { replyFacts } from "@/data/defenceData";
import type { Lang } from "@/data/defenceData";

interface Props { lang: Lang; }

function SectionBox({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: "border-[#18294F] bg-[#EEF2FA]",
    red: "border-red-500 bg-red-50",
    orange: "border-orange-500 bg-orange-50",
    green: "border-green-600 bg-green-50",
    gold: "border-[#B48C1E] bg-yellow-50",
    purple: "border-purple-600 bg-purple-50",
  };
  return (
    <div className={`rounded-lg border-2 overflow-hidden ${colors[color] || colors.blue}`}>
      {children}
    </div>
  );
}

function Header({ en, hi, lang, color = "#18294F" }: { en: string; hi: string; lang: Lang; color?: string }) {
  return (
    <div className="px-4 py-2 font-bold text-sm text-white" style={{ backgroundColor: color }}>
      {lang !== "hi" && en}
      {lang === "both" && <span className="ml-2 font-normal text-white/80">— {hi}</span>}
      {lang === "hi" && hi}
    </div>
  );
}

function Body({ en, hi, lang }: { en: string; hi: string; lang: Lang }) {
  return (
    <div className="p-4 space-y-3 text-sm text-gray-800 leading-relaxed bg-white">
      {lang !== "hi" && <p className="whitespace-pre-line">{en}</p>}
      {lang !== "en" && <p className={`whitespace-pre-line${lang === "both" ? " border-t pt-3 text-[#18294F]/90" : ""}`}>{hi}</p>}
    </div>
  );
}

export default function ReplyPage({ lang }: Props) {
  const showEn = lang !== "hi";
  const showHi = lang !== "en";
  const f = replyFacts;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl border-2 border-[#B48C1E] bg-[#18294F] text-white p-5">
        <h1 className="text-xl font-bold">
          {showEn && "Hemraj's Reply — Incorporated Facts & Arguments"}
        </h1>
        {showHi && <div className="text-white/80 font-semibold">हेमराज का जवाब — शामिल किये गये तथ्य एवं तर्क</div>}
        <p className="text-white/60 text-xs mt-1">
          Source: Pages 01–06 of the written reply submitted in proceedings | ACB investigation, Rajasthan
        </p>
      </div>

      {/* Source note */}
      <div className="rounded-lg border border-[#B48C1E] bg-yellow-50 p-3 text-xs text-[#7A6010] leading-relaxed">
        <strong>Source documents:</strong> Six pages of Hemraj's actual written reply filed in the proceedings. All facts below are taken verbatim from those pages and incorporated into the defence brief as additional grounds. The page reference is noted under each section.
        {showHi && (
          <div className="mt-1 text-[#7A6010]">
            स्रोत: कार्यवाही में दाखिल हेमराज के छः पृष्ठ के वास्तविक लिखित जवाब से। सभी तथ्य उन पृष्ठों से शब्दशः लिए गये हैं।
          </div>
        )}
      </div>

      {/* 1. Project context */}
      <SectionBox color="blue">
        <Header en={f.projectContext.titleEn} hi={f.projectContext.titleHi} lang={lang} />
        <div className="p-4 bg-white text-sm space-y-2">
          <div className="bg-[#EEF2FA] rounded p-2 text-[#18294F]">
            <span className="font-bold">Agency: </span>{showEn && f.projectContext.agencyEn}{showHi && <span className="text-[#18294F]/80"> | {f.projectContext.agencyHi}</span>}
          </div>
          {showEn && <p className="text-gray-700">{f.projectContext.technicalCommitteeEn}</p>}
          {showHi && <p className="text-gray-700">{f.projectContext.technicalCommitteeHi}</p>}
          <p className="text-xs text-gray-500 italic">Source: Page 01 of reply</p>
        </div>
      </SectionBox>

      {/* 2. Construction timeline */}
      <SectionBox color="red">
        <Header en={f.constructionTimeline.titleEn} hi={f.constructionTimeline.titleHi} lang={lang} color="#b91c1c" />
        <div className="p-4 bg-white space-y-3">
          <div className="relative">
            {f.constructionTimeline.events.map((ev, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-700 text-white text-xs flex items-center justify-center font-bold">{i + 1}</div>
                <div className="flex-1 text-sm">
                  {showEn && <div className="text-gray-800">{ev.en}</div>}
                  {showHi && <div className="text-[#18294F]/80 text-xs mt-0.5">{ev.hi}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-red-50 border border-red-300 rounded p-3 text-xs leading-relaxed">
            <span className="font-bold text-red-800">Legal Significance: </span>
            {showEn && <span className="text-red-700">{f.constructionTimeline.legalSignificanceEn}</span>}
            {showHi && <p className="text-red-700 mt-1">{f.constructionTimeline.legalSignificanceHi}</p>}
          </div>
          <p className="text-xs text-gray-500 italic">Source: Pages 03, 06 of reply</p>
        </div>
      </SectionBox>

      {/* 3. Sample storage in cement bags */}
      <SectionBox color="orange">
        <Header en={f.sampleStorageConditions.titleEn} hi={f.sampleStorageConditions.titleHi} lang={lang} color="#c2410c" />
        <Body en={f.sampleStorageConditions.enText} hi={f.sampleStorageConditions.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Page 03 of reply</div>
      </SectionBox>

      {/* 4. Marble slurry */}
      <SectionBox color="orange">
        <Header en={f.marbLeSlurryConditions.titleEn} hi={f.marbLeSlurryConditions.titleHi} lang={lang} color="#b45309" />
        <Body en={f.marbLeSlurryConditions.enText} hi={f.marbLeSlurryConditions.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Page 03 of reply</div>
      </SectionBox>

      {/* 5. G-Schedule comparison */}
      <SectionBox color="blue">
        <Header en={f.gScheduleComparison.titleEn} hi={f.gScheduleComparison.titleHi} lang={lang} />
        <div className="p-4 bg-white space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#18294F] text-white">
                  <th className="border border-gray-300 px-3 py-2 text-left">S.No.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Sample / नमूना</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">G-Schedule Spec.</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">FSL Result</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {f.gScheduleComparison.rows.map((row) => (
                  <tr key={row.sno} className={row.verdict === "MATCH" ? "bg-green-50" : "bg-red-50"}>
                    <td className="border border-gray-300 px-3 py-2 text-center">{row.sno}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {showEn && <div>{row.item}</div>}
                      {showHi && <div className="text-[#18294F]/70 text-xs">{row.itemHi}</div>}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-mono font-bold text-[#18294F]">{row.specRequired}</td>
                    <td className={`border border-gray-300 px-3 py-2 text-center font-mono font-bold ${row.verdict === "MATCH" ? "text-green-700" : "text-red-700"}`}>{row.fslResult}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${row.verdict === "MATCH" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                        {showEn ? row.verdict : row.verdictHi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[#EEF2FA] rounded p-3 text-xs text-gray-700 leading-relaxed">
            {showEn && <p>{f.gScheduleComparison.noteEn}</p>}
            {showHi && <p className={showEn ? "mt-2 text-[#18294F]/80" : ""}>{f.gScheduleComparison.noteHi}</p>}
          </div>
          <p className="text-xs text-gray-500 italic">Source: Page 02 of reply</p>
        </div>
      </SectionBox>

      {/* 6. Insufficient sampling quantity */}
      <SectionBox color="red">
        <Header en={f.insufficientSamplingQuantity.titleEn} hi={f.insufficientSamplingQuantity.titleHi} lang={lang} color="#b91c1c" />
        <div className="p-4 bg-white space-y-3">
          <div className="bg-yellow-50 border border-yellow-300 rounded p-2 text-xs font-semibold text-[#7A6010]">
            {f.insufficientSamplingQuantity.isStandard}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {f.insufficientSamplingQuantity.frequencies.map((fr, i) => (
              <div key={i} className="bg-[#EEF2FA] rounded p-2 text-xs">
                <div className="font-bold text-[#18294F]">{fr.item}</div>
                <div className="text-gray-600 mt-0.5">{fr.freq}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-red-800 text-white">
                  <th className="border border-gray-300 px-3 py-2">S.N.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-3 py-2">Quantity</th>
                  <th className="border border-gray-300 px-3 py-2">Samples Required</th>
                  <th className="border border-gray-300 px-3 py-2">ACB Took</th>
                </tr>
              </thead>
              <tbody>
                {f.insufficientSamplingQuantity.workQuantities.map((row) => (
                  <tr key={row.sno} className="bg-red-50">
                    <td className="border border-gray-300 px-3 py-2 text-center">{row.sno}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {showEn && <div className="font-semibold">{row.item}</div>}
                      {showHi && <div className="text-xs text-gray-600">{row.itemHi}</div>}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-mono">{row.qty}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-[#18294F]">{row.required}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-red-700">{row.acbTook}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-sm text-gray-800 bg-red-50 border border-red-200 rounded p-3 leading-relaxed">
            {showEn && <p>{f.insufficientSamplingQuantity.enText}</p>}
            {showHi && <p className={showEn ? "mt-2 border-t pt-2" : ""}>{f.insufficientSamplingQuantity.hiText}</p>}
          </div>
          <p className="text-xs text-gray-500 italic">Source: Pages 03–04 of reply | IS 456:2000 Cl.15.2.2 Pg.29</p>
        </div>
      </SectionBox>

      {/* 7. Rahul Engineering NABL */}
      <SectionBox color="green">
        <Header en={f.rahulEngineeringNABL.titleEn} hi={f.rahulEngineeringNABL.titleHi} lang={lang} color="#15803d" />
        <Body en={f.rahulEngineeringNABL.enText} hi={f.rahulEngineeringNABL.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Pages 01, 04 of reply</div>
      </SectionBox>

      {/* 8. Photographs in file */}
      <SectionBox color="purple">
        <Header en={f.photographsInFile.titleEn} hi={f.photographsInFile.titleHi} lang={lang} color="#7e22ce" />
        <Body en={f.photographsInFile.enText} hi={f.photographsInFile.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Page 05 of reply</div>
      </SectionBox>

      {/* 9. Investigation malice */}
      <SectionBox color="orange">
        <Header en={f.investigationMalice.titleEn} hi={f.investigationMalice.titleHi} lang={lang} color="#9a3412" />
        <Body en={f.investigationMalice.enText} hi={f.investigationMalice.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Pages 04, 06 of reply</div>
      </SectionBox>

      {/* 10. Physical impossibility */}
      <SectionBox color="blue">
        <Header en={f.physicalImpossibilityArgument.titleEn} hi={f.physicalImpossibilityArgument.titleHi} lang={lang} />
        <Body en={f.physicalImpossibilityArgument.enText} hi={f.physicalImpossibilityArgument.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Page 05 of reply (Point 6)</div>
      </SectionBox>

      {/* 11. FSL not prescribed */}
      <SectionBox color="gold">
        <Header en={f.fslNotPrescribedByISCodes.titleEn} hi={f.fslNotPrescribedByISCodes.titleHi} lang={lang} color="#92400e" />
        <Body en={f.fslNotPrescribedByISCodes.enText} hi={f.fslNotPrescribedByISCodes.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Page 02 of reply (Point जवाब)</div>
      </SectionBox>

      {/* 12. Single sample not representative */}
      <SectionBox color="blue">
        <Header en={f.singleSampleNotRepresentative.titleEn} hi={f.singleSampleNotRepresentative.titleHi} lang={lang} />
        <Body en={f.singleSampleNotRepresentative.enText} hi={f.singleSampleNotRepresentative.hiText} lang={lang} />
        <div className="px-4 pb-3 text-xs text-gray-500 italic bg-white">Source: Pages 04–05 of reply (Point 5)</div>
      </SectionBox>

      <div className="text-center text-xs text-gray-500 italic border-t pt-3">
        All facts above are taken verbatim from Hemraj's written reply (Pages 01–06). 
        Cross-reference with the Packet A/B/C defence grounds for the corresponding IS standard citations.
      </div>
    </div>
  );
}
