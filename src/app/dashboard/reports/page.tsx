'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, CheckCircle, XCircle, Eye } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';

interface Report {
  _id: string;
  targetType: string;
  targetId: string;
  reason: string;
  details?: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  reporterId?: { username?: string; displayName?: string };
  createdAt: string;
}

interface Paginated {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-amber-500/15 text-amber-400',
  reviewing: 'bg-blue-500/15 text-blue-400',
  resolved: 'bg-emerald-500/15 text-emerald-400',
  dismissed: 'bg-slate-500/15 text-slate-400',
};

export default function ReportsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports', page, status],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      const { data } = await api.get<{ data: Paginated }>('/reports', { params });
      return data.data;
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, next }: { id: string; next: string }) =>
      api.patch(`/reports/${id}`, { status: next }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reports'] }),
    onError: (err) => setError(extractError(err)),
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_REPORTS}>
      <TopBar title="Reports & Moderation" />
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
          <Flag size={18} className="text-slate-400 flex-shrink-0" />
          {['', 'open', 'reviewing', 'resolved', 'dismissed'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`rounded-full px-3 py-1 text-sm flex-shrink-0 transition-colors ${status === s ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              {s === '' ? 'All' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        {isLoading ? (
          <PageLoader />
        ) : !data || data.reports.length === 0 ? (
          <p className="text-slate-400">No reports.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-slate-800 bg-slate-900">
              {data.reports.map((r) => (
                <div key={r._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-semibold capitalize text-slate-200 text-sm">{r.targetType}</span>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{r.targetId}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs border-t border-slate-800/40 pt-2.5">
                    <span className="text-slate-500">Reason</span>
                    <span className="text-slate-300 text-right capitalize">{r.reason}</span>
                    {r.details && (
                      <>
                        <span className="text-slate-500">Details</span>
                        <span className="text-slate-300 text-right truncate pl-4">{r.details}</span>
                      </>
                    )}
                    <span className="text-slate-500">Reporter</span>
                    <span className="text-slate-300 text-right">{r.reporterId?.displayName || r.reporterId?.username || '—'}</span>
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-400 text-right">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800/50">
                    {r.status === 'open' && (
                      <Button size="sm" variant="secondary" onClick={() => updateMut.mutate({ id: r._id, next: 'reviewing' })}>
                        <Eye size={14} /> <span className="ml-1 text-xs">Review</span>
                      </Button>
                    )}
                    {r.status !== 'resolved' && r.status !== 'dismissed' && (
                      <>
                        <Button size="sm" onClick={() => updateMut.mutate({ id: r._id, next: 'resolved' })}>
                          <CheckCircle size={14} /> <span className="ml-1 text-xs">Resolve</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updateMut.mutate({ id: r._id, next: 'dismissed' })}>
                          <XCircle size={14} /> <span className="ml-1 text-xs">Dismiss</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Reporter</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.reports.map((r) => (
                    <tr key={r._id} className="text-slate-200">
                      <td className="px-4 py-3">
                        <span className="font-medium capitalize">{r.targetType}</span>
                        <div className="text-xs text-slate-500">{r.targetId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize">{r.reason}</span>
                        {r.details && <div className="max-w-xs truncate text-xs text-slate-500">{r.details}</div>}
                      </td>
                      <td className="px-4 py-3">{r.reporterId?.displayName || r.reporterId?.username || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {r.status === 'open' && (
                            <Button size="sm" variant="secondary" onClick={() => updateMut.mutate({ id: r._id, next: 'reviewing' })}>
                              <Eye size={14} /> Review
                            </Button>
                          )}
                          {r.status !== 'resolved' && r.status !== 'dismissed' && (
                            <>
                              <Button size="sm" onClick={() => updateMut.mutate({ id: r._id, next: 'resolved' })}>
                                <CheckCircle size={14} /> Resolve
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => updateMut.mutate({ id: r._id, next: 'dismissed' })}>
                                <XCircle size={14} /> Dismiss
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="mt-4">
            <Pagination page={page} totalPages={data.totalPages} total={data.total} limit={20} onChange={setPage} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
