import { useState } from "react";
import { packetA, packetB, packetC } from "@/data/defenceData";
import type { Lang, Packet } from "@/data/defenceData";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props { packetId: "A" | "B" | "C"; lang: Lang; }

function GroundCard({ ground, lang }: { ground: Packet["grounds"][0]; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const showEn = lang !== "hi";
  const showHi = lang !== "en";
  return (
    <div className={`rounded-lg border-2 ${ground.critical ? "border-red-500" : "border-[#18294F]/40"} mb-3 overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left flex items-start justify-between p-3 ${ground.critical ? "bg-red-50 hover:bg-red-100" : "bg-[#EEF2FA] hover:bg-blue-100"} transition-colors`}
      >
        <div className="flex-1 pr-2">
          {showEn && <div className={`font-bold text-sm ${ground.critical ? "text-red-800" : "text-[#18294F]"}`}>{ground.titleEn}</div>}
          {showHi && <div className="text-sm text-[#18294F]/80 font-semibold">{ground.titleHi}</div>}
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-white">
          {showEn && (
            <div>
              <div className="text-sm text-gray-800 leading-relaxed bg-blue-50 border border-blue-200 rounded p-3">{ground.defenceEn}</div>
              {ground.standardsEn && (
                <div className="mt-2 text-xs text-[#7A6010] bg-yellow-50 border border-yellow-300 rounded p-3 leading-relaxed whitespace-pre-line">{ground.standardsEn}</div>
              )}
            </div>
          )}
          {showHi && (
            <div className={showEn ? "border-t pt-3" : ""}>
              <div className="text-sm text-gray-800 leading-relaxed bg-blue-50 border border-blue-200 rounded p-3">{ground.defenceHi}</div>
              {ground.standardsHi && (
                <div className="mt-2 text-xs text-[#7A6010] bg-yellow-50 border border-yellow-300 rounded p-3 leading-relaxed whitespace-pre-line">{ground.standardsHi}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ ch, lang }: { ch: Packet["challenges"][0]; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const showEn = lang !== "hi";
  const showHi = lang !== "en";
  return (
    <div className={`rounded-lg border-2 ${ch.critical ? "border-orange-500" : "border-[#B48C1E]/50"} mb-3 overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left flex items-start justify-between p-3 ${ch.critical ? "bg-orange-50 hover:bg-orange-100" : "bg-yellow-50 hover:bg-yellow-100"} transition-colors`}
      >
        <div className="flex-1 pr-2">
          {showEn && <div className={`font-bold text-sm ${ch.critical ? "text-orange-800" : "text-[#7A6010]"}`}>{ch.titleEn}</div>}
          {showHi && <div className="text-sm text-[#18294F]/80 font-semibold">{ch.titleHi}</div>}
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-white">
          {showEn && (
            <div>
              <div className="text-sm text-gray-800 leading-relaxed bg-orange-50 border border-orange-200 rounded p-3">{ch.bodyEn}</div>
              {ch.standardsEn && (
                <div className="mt-2 text-xs text-[#7A6010] bg-yellow-50 border border-yellow-300 rounded p-3 leading-relaxed whitespace-pre-line">{ch.standardsEn}</div>
              )}
            </div>
          )}
          {showHi && (
            <div className={showEn ? "border-t pt-3" : ""}>
              <div className="text-sm text-gray-800 leading-relaxed bg-orange-50 border border-orange-200 rounded p-3">{ch.bodyHi}</div>
              {ch.standardsHi && (
                <div className="mt-2 text-xs text-[#7A6010] bg-yellow-50 border border-yellow-300 rounded p-3 leading-relaxed whitespace-pre-line">{ch.standardsHi}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PacketPage({ packetId, lang }: Props) {
  const packet = packetId === "A" ? packetA : packetId === "B" ? packetB : packetC;
  const showEn = lang !== "hi";
  const showHi = lang !== "en";
  const [allGroundsOpen, setAllGroundsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Packet header */}
      <div className="rounded-xl border-2 border-[#18294F] bg-[#18294F] text-white p-5">
        <h1 className="text-xl font-bold">{showEn && packet.info.labelEn}</h1>
        {showHi && <div className="text-white/80 font-semibold">{packet.info.labelHi}</div>}
      </div>

      {/* Packet info table */}
      <div className="rounded-lg border border-[#18294F] overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="bg-[#EEF2FA] px-4 py-2 font-bold text-[#18294F] w-40">Material</td>
              <td className="px-4 py-2">
                {showEn && packet.info.material.en}
                {showHi && <div className="text-gray-600">{packet.info.material.hi}</div>}
              </td>
            </tr>
            <tr className="border-b border-gray-200 bg-red-50">
              <td className="px-4 py-2 font-bold text-red-800">FSL Result</td>
              <td className="px-4 py-2 font-mono font-bold text-red-700">{packet.info.fslResult.en}
                {showHi && <span className="ml-2 text-red-600 font-sans font-semibold text-xs">({packet.info.fslResult.hi})</span>}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="bg-[#EEF2FA] px-4 py-2 font-bold text-[#18294F]">Applicable Std.</td>
              <td className="px-4 py-2">
                {showEn && packet.info.applicableStd.en}
                {showHi && <div className="text-gray-600 text-xs">{packet.info.applicableStd.hi}</div>}
              </td>
            </tr>
            <tr>
              <td className="bg-yellow-50 px-4 py-2 font-bold text-yellow-800">Key Observation</td>
              <td className="bg-yellow-50 px-4 py-2 text-yellow-900">
                {showEn && packet.info.keyObs.en}
                {showHi && <div className="text-yellow-800 text-xs mt-1">{packet.info.keyObs.hi}</div>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Procedural Grounds */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#18294F]">
            {showEn && "Procedural Grounds (9)"}
            {showHi && <span className={showEn ? "ml-2 text-sm font-normal text-[#18294F]/70" : ""}>{showEn ? "— नौ प्रक्रियागत आधार" : "नौ प्रक्रियागत आधार"}</span>}
          </h2>
          <button
            onClick={() => setAllGroundsOpen(!allGroundsOpen)}
            className="text-xs text-[#18294F] underline"
          >
            {allGroundsOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        {packet.grounds.map((g) => (
          <GroundCard key={g.number} ground={g} lang={lang} />
        ))}
      </div>

      {/* Material-specific challenges */}
      <div>
        <h2 className="text-lg font-bold text-[#18294F] mb-3">
          {showEn && "Material-Specific Scientific Challenges"}
          {showHi && <span className={showEn ? "block text-sm font-normal text-[#18294F]/70" : ""}>सामग्री-विशिष्ट वैज्ञानिक चुनौतियाँ</span>}
        </h2>
        {packet.challenges.map((ch) => (
          <ChallengeCard key={ch.id} ch={ch} lang={lang} />
        ))}
      </div>
    </div>
  );
}
