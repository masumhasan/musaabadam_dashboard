'use client';

import { Calendar } from 'lucide-react';

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'lifetime';

interface TimeframeFilterProps {
  value: Timeframe;
  onChange: (value: Timeframe) => void;
  showIcon?: boolean;
}

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Lifetime', value: 'lifetime' },
];

export function TimeframeFilter({ value, onChange, showIcon = true }: TimeframeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showIcon && (
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mr-1">
          <Calendar size={14} />
          <span>Filter:</span>
        </div>
      )}
      <div className="flex overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs font-medium max-w-full scrollbar-none">
        {TIMEFRAMES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`rounded-md px-3 py-1.5 transition-all duration-200 ${
              value === t.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
