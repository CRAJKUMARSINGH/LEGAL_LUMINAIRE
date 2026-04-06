import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { Bot } from 'lucide-react';

type RadarData = {
  subject: string;
  A: number;
  fullMark: number;
};

export const ForensicRadar = ({ data }: { data: RadarData[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
        Insufficient data for Risk Radar
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
            <Radar
              name="Risk Profile"
              dataKey="A"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="#3b82f6"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Week 8: The Explanation Layer (Virtual Senior Advocate) */}
      <div className="p-4 bg-slate-50/50 border-t mt-auto">
        <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-1">
           <Bot className="w-3 h-3" /> Senior's Insight (Tutorial Mode)
        </p>
        <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
           {data.length > 0 && data[0].A > 3 
              ? "🚨 Senior's Strategy: The 'Sampling Protocol' gap is your strongest point. See State of Rajasthan v. Daulat Ram (SC 1980) — any delay in FSL transit without a strict chain-of-custody log is fatal to the prosecution's forensic claim. Use this as your primary Ground of Bail."
              : "⚖️ Senior's Strategy: Forensic markers appear standard. Shift focus to procedural lapses in the Search & Seizure memo (Panchnama) under §100(4) CrPC / §103 BNSS, specifically the lack of independent public witnesses."}
        </p>
      </div>
    </div>
  );
};
