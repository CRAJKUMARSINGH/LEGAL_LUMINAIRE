import { packetA, packetB, packetC, commonSection, verifiedPrecedents, standardsCited } from "@/data/defenceData";
import type { Lang, Packet } from "@/data/defenceData";

interface Props { lang: Lang; }

function PrintSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 print-full">
      <h2 className="text-base font-bold text-[#18294F] border-b-2 border-[#18294F] pb-1 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function PacketBlock({ packet, lang }: { packet: Packet; lang: Lang }) {
  const showEn = lang !== "hi";
  const showHi = lang !== "en";
  return (
    <div className="mb-8">
      <h3 className="font-bold text-[#18294F] text-sm border border-[#18294F] bg-[#EEF2FA] px-3 py-1 mb-3">
        {showEn && packet.info.labelEn}
        {showHi && <span className={showEn ? "ml-2 font-normal text-[#18294F]/70" : ""}>{packet.info.labelHi}</span>}
      </h3>
      <p className="text-xs text-red-700 font-bold mb-2">
        FSL Result: {packet.info.fslResult.en} | Standard: {packet.info.applicableStd.en}
      </p>
      <div className="space-y-2">
        {packet.grounds.map(g => (
          <div key={g.number} className={`text-xs border rounded p-2 ${g.critical ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
            {showEn && <div className="font-bold text-[#18294F]">{g.titleEn}</div>}
            {showHi && <div className="font-semibold text-[#18294F]/80">{g.titleHi}</div>}
            {showEn && <p className="mt-1 text-gray-700 leading-relaxed">{g.defenceEn}</p>}
            {showHi && <p className="mt-1 text-gray-700 leading-relaxed">{g.defenceHi}</p>}
            {showEn && g.standardsEn && <p className="mt-1 text-[#7A6010] text-xs leading-relaxed bg-yellow-50 p-1 rounded">{g.standardsEn}</p>}
            {showHi && g.standardsHi && <p className="mt-1 text-[#7A6010] text-xs leading-relaxed bg-yellow-50 p-1 rounded">{g.standardsHi}</p>}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {packet.challenges.map(ch => (
          <div key={ch.id} className={`text-xs border rounded p-2 ${ch.critical ? "border-orange-300 bg-orange-50" : "border-yellow-200 bg-yellow-50"}`}>
            {showEn && <div className="font-bold text-orange-800">{ch.titleEn}</div>}
            {showHi && <div className="font-semibold text-orange-700">{ch.titleHi}</div>}
            {showEn && <p className="mt-1 text-gray-700 leading-relaxed">{ch.bodyEn}</p>}
            {showHi && <p className="mt-1 text-gray-700 leading-relaxed">{ch.bodyHi}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrintPage({ lang }: Props) {
  const showEn = lang !== "hi";
  const showHi = lang !== "en";

  return (
    <div>
      {/* Print button */}
      <div className="no-print mb-6 flex gap-3 items-center">
        <button
          onClick={() => window.print()}
          className="bg-[#18294F] text-white px-6 py-2 rounded font-semibold hover:bg-[#0e1a35] transition-colors"
        >
          Print / Save as PDF
        </button>
        <span className="text-xs text-gray-500">Use browser Print → Save as PDF for best results. All pages will print.</span>
      </div>

      {/* Print document */}
      <div className="text-xs leading-relaxed font-serif">
        {/* Title */}
        <div className="text-center mb-6 border-2 border-[#18294F] p-4">
          <h1 className="text-lg font-bold text-[#18294F]">CONTRACTOR DEFENCE BRIEF</h1>
          {showHi && <p className="text-[#18294F] font-semibold">ठेकेदार बचाव संक्षेप</p>}
          <p className="text-sm text-gray-600 mt-1">Challenge to the FSL Report — Rajya Vidhi Vigyan Prayogshala, Jaipur</p>
          <p className="text-xs text-gray-500">Respondent: Contractor Hemraj | Signing Officers: KL Verma (SSO Physics) & Dr. Shailendra Jha</p>
          <p className="text-xs text-red-700 mt-2 italic font-bold">FIVE-AGENT CROSS-CHECK VERIFIED | DISCLAIMER: Verify all IS citations against BIS originals before court use.</p>
        </div>

        <PrintSection title="SAMPLES UNDER CHALLENGE | परीक्षित नमूने">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#18294F] text-white">
                <th className="border border-gray-400 px-2 py-1">Packet</th>
                <th className="border border-gray-400 px-2 py-1">Material</th>
                <th className="border border-gray-400 px-2 py-1">FSL Result</th>
                <th className="border border-gray-400 px-2 py-1">Standard</th>
              </tr>
            </thead>
            <tbody>
              {[packetA, packetB, packetC].map(p => (
                <tr key={p.info.id}>
                  <td className="border border-gray-300 px-2 py-1 font-bold">{p.info.id}</td>
                  <td className="border border-gray-300 px-2 py-1">{p.info.material.en}{showHi && <span className="text-gray-500"> / {p.info.material.hi}</span>}</td>
                  <td className="border border-gray-300 px-2 py-1 font-mono font-bold text-red-700">{p.info.fslResult.en}</td>
                  <td className="border border-gray-300 px-2 py-1">{p.info.applicableStd.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PrintSection>

        <PrintSection title="PART I — PACKET A: CEMENT PLASTER | भाग-I — पैकेट A: सीमेंट प्लास्टर">
          <PacketBlock packet={packetA} lang={lang} />
        </PrintSection>

        <PrintSection title="PART II — PACKET B: MASONRY MORTAR | भाग-II — पैकेट B: पत्थर चिनाई मसाला">
          <PacketBlock packet={packetB} lang={lang} />
        </PrintSection>

        <PrintSection title="PART III — PACKET C: FOUNDATION CONCRETE | भाग-III — पैकेट C: नींव कंक्रीट">
          <PacketBlock packet={packetC} lang={lang} />
        </PrintSection>

        <PrintSection title="THE 21% SILICA ASSUMPTION | 21% सिलिका मान्यता">
          <div className="border border-red-300 bg-red-50 p-2 rounded mb-2 text-xs italic">
            FSL Statement: "As the Control Sample has not been supplied the ratio is calculated presuming that good quality Cement contains 21% of soluble silica."
          </div>
          {showEn && <div className="text-xs leading-relaxed whitespace-pre-line">{commonSection.silicaAssumptionEn}</div>}
          {showHi && <div className="text-xs leading-relaxed whitespace-pre-line mt-2">{commonSection.silicaAssumptionHi}</div>}
        </PrintSection>

        <PrintSection title="CONCLUSIONS | निष्कर्ष">
          {showEn && <div className="text-xs leading-relaxed whitespace-pre-line">{commonSection.conclusionEn}</div>}
          {showHi && <div className="text-xs leading-relaxed whitespace-pre-line mt-2">{commonSection.conclusionHi}</div>}
        </PrintSection>

        <PrintSection title="PRAYER | प्रार्थना">
          {showEn && <div className="text-xs leading-relaxed whitespace-pre-line">{commonSection.prayerEn}</div>}
          {showHi && <div className="text-xs leading-relaxed whitespace-pre-line mt-2">{commonSection.prayerHi}</div>}
        </PrintSection>

        <PrintSection title="SC/HC PRECEDENTS (10 VERIFIED) | पूर्वनिर्णय">
          <div className="space-y-2">
            {verifiedPrecedents.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded p-2">
                <div className="font-bold text-[#18294F]">{p.citation}</div>
                <div className="text-gray-700 mt-1">{p.principle}</div>
                <div className="text-[#18294F] text-xs mt-1">Applies to: {p.grounds}</div>
              </div>
            ))}
          </div>
        </PrintSection>

        <PrintSection title="STANDARDS CITED (23) | उद्धृत मानक">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">Standard</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Title</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {standardsCited.map((s, i) => (
                <tr key={s.std} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-2 py-1 font-mono font-bold">{s.std}</td>
                  <td className="border border-gray-300 px-2 py-1">{s.title}</td>
                  <td className="border border-gray-300 px-2 py-1">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PrintSection>

        <div className="text-center text-xs text-gray-500 italic border-t pt-2 mt-4">
          Legal Luminaire — Rajasthan Construction Law Defence System |
          DISCLAIMER: All IS citations must be verified against BIS originals (bis.gov.in) before court use.
        </div>
      </div>
    </div>
  );
}
