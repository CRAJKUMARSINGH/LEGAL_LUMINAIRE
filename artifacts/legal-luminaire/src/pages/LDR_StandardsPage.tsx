import { standardsCited } from "@/data/defenceData";

export default function StandardsPage() {
  const groups = [
    { label: "Sampling & Testing (Mortar/Plaster)", filter: (s: string) => s.startsWith("IS 1199") || s.startsWith("IS 516") || s.startsWith("IS 4031") },
    { label: "Plaster Standards", filter: (s: string) => s.startsWith("IS 1661") || s.startsWith("IS 2402") || s.startsWith("IS 1542") || s.startsWith("IS 269") },
    { label: "Masonry Mortar Standards", filter: (s: string) => s.startsWith("IS 2250") || s.startsWith("IS 1597") || s.startsWith("IS 2116") || s.startsWith("IS 383") },
    { label: "Concrete Standards", filter: (s: string) => s.startsWith("IS 456") || s.startsWith("IS 10262") || s.startsWith("IS 13311") },
    { label: "Laboratory & Quality Assurance", filter: (s: string) => s.startsWith("IS/IEC") || s.startsWith("NABL") },
    { label: "International Standards (ASTM / BS EN)", filter: (s: string) => s.startsWith("ASTM") || s.startsWith("BS EN") },
  ];

  const categorized = groups.flatMap(g => standardsCited.filter(s => g.filter(s.std)).map(s => ({ ...s, group: g.label })));
  const uncategorized = standardsCited.filter(s => !categorized.find(c => c.std === s.std));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border-2 border-[#18294F] bg-[#18294F] text-white p-5">
        <h1 className="text-xl font-bold">Standards Index — 23 Cited</h1>
        <div className="text-white/70 text-sm mt-1">All IS, ASTM, BS EN, NABL and ISO/IEC standards referenced in this brief</div>
        <div className="text-white/60 text-xs mt-0.5">मानक सूचकांक — 23 उद्धृत मानक</div>
      </div>

      {groups.map(g => {
        const items = standardsCited.filter(s => g.filter(s.std));
        if (!items.length) return null;
        return (
          <div key={g.label} className="rounded-lg border border-[#18294F] overflow-hidden">
            <div className="bg-[#18294F] text-white px-4 py-2 font-bold text-sm">{g.label}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#EEF2FA]">
                  <th className="text-left px-4 py-2 text-[#18294F] font-bold w-44">Standard</th>
                  <th className="text-left px-4 py-2 text-[#18294F] font-bold">Title</th>
                  <th className="text-left px-4 py-2 text-[#18294F] font-bold w-32">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s, i) => (
                  <tr key={s.std} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 font-mono text-xs font-bold text-[#18294F]">{s.std}</td>
                    <td className="px-4 py-2 text-gray-800">{s.title}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${s.status === "Current" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {uncategorized.length > 0 && (
        <div className="rounded-lg border border-gray-300 overflow-hidden">
          <div className="bg-gray-600 text-white px-4 py-2 font-bold text-sm">Other</div>
          <table className="w-full text-sm">
            <tbody>
              {uncategorized.map((s, i) => (
                <tr key={s.std} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 font-mono text-xs font-bold">{s.std}</td>
                  <td className="px-4 py-2 text-gray-800">{s.title}</td>
                  <td className="px-4 py-2 text-xs">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center text-xs text-gray-500 italic border-t pt-3">
        Verify all IS standards at bis.gov.in · ASTM at astm.org · BS EN at standards.bsigroup.com
      </div>
    </div>
  );
}
