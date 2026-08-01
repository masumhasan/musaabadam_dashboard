'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StreamsDataPoint {
  _id: string;
  newStreams: number;
}

interface StreamsChartProps {
  data: StreamsDataPoint[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-2xl text-sm">
      <p className="mb-1 text-xs font-semibold text-slate-400">{label ? formatDate(label) : ''}</p>
      <p className="font-semibold text-slate-100">
        <span className="text-slate-400">Streams: </span>
        {payload[0].value}
      </p>
    </div>
  );
}

export function StreamsChart({ data }: StreamsChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-500">
        No data for this period.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="_id"
          tickFormatter={formatDate}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={32}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
        <Bar
          dataKey="newStreams"
          fill="var(--chart-4)"
          fillOpacity={0.85}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          animationDuration={1100}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
