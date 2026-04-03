import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

type HeatmapData = {
  date: string;
  count: number;
};

export const TimelineHeatmap = ({ data }: { data: HeatmapData[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
        No timeline clusters found
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sortedData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b10" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 9, fill: '#64748b' }} 
          axisLine={false} 
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 9, fill: '#64748b' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', border: 'none', 
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
            fontSize: '12px' 
          }}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {sortedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.count > 2 ? '#3b82f6' : '#94a3b8'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
