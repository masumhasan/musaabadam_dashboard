'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHeader } from '@/components/layout/PageHeader';

export default function DmsPage() {
  return (
    <ProtectedRoute permission="VIEW_REPORTS">
      <div className="space-y-6">
        <PageHeader title="Direct Messages (DMs)" description="Monitor user communications for safety and compliance." />
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-slate-400">The global direct messaging view is under development.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
