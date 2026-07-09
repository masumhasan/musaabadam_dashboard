'use client';

import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function OffersPage() {
  return (
    <ProtectedRoute permission="VIEW_ANALYTICS">
      <TopBar title="Offers" subtitle="Monitor platform offers" />
      <div className="p-6 space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-slate-400">The global offers view is under development.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
