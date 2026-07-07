'use client';

import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import { BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Analytics" subtitle="Platform performance metrics" />
      <div className="flex h-full min-h-96 flex-col items-center justify-center gap-3 text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
          <BarChart2 size={32} className="text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-200">Analytics coming soon</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Revenue charts, GMV trends, and user growth metrics will be available after the Orders and Payments modules are complete.
        </p>
      </div>
    </ProtectedRoute>
  );
}
