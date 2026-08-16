'use client';

import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'indigo';
  sub?: string;
}

const ACCENT_STYLES: Record<string, { bg: string; icon: string; glow: string }> = {
  blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   glow: 'shadow-blue-500/10' },
  green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  glow: 'shadow-green-500/10' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', glow: 'shadow-purple-500/10' },
  amber:  { bg: 'bg-amber-500/10',  icon: 'text-amber-400',  glow: 'shadow-amber-500/10' },
  red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    glow: 'shadow-red-500/10' },
  indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
};

export function KpiCard({ label, value, icon: Icon, accent, sub }: KpiCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-lg ${styles.glow} transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-700`}
    >
      {/* Background glow orb */}
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${styles.bg} blur-2xl`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-slate-500">{label}</p>
          <p className="mt-2 text-xl sm:text-3xl font-bold tabular-nums text-slate-100">{value}</p>
          {sub && <p className="mt-1 text-[10px] sm:text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.bg}`}>
          <Icon size={20} className={styles.icon} />
        </div>
      </div>
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-3 w-24 rounded bg-slate-800" />
          <div className="mt-2 h-8 w-32 rounded bg-slate-800" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}
