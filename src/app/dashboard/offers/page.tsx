'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHeader } from '@/components/layout/PageHeader';

export default function OffersPage() {
  return (
    <ProtectedRoute permission="VIEW_ANALYTICS">
      <div className="space-y-6">
        <PageHeader title="Offers" description="Monitor buyer offers across the platform." />
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-slate-400">The global offers view is under development.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
