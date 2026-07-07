'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Radio, StopCircle } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';

interface Stream {
  _id: string;
  title: string;
  status: string;
  totalViewers: number;
  currentViewers?: number;
  startedAt?: string;
  createdAt: string;
  sellerId?: { username?: string; displayName?: string };
  recordingStatus?: string;
  recordingUrl?: string;
}

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-red-500/15 text-red-400',
  scheduled: 'bg-amber-500/15 text-amber-400',
  ended: 'bg-slate-500/15 text-slate-400',
  cancelled: 'bg-slate-500/15 text-slate-400',
  draft: 'bg-slate-500/15 text-slate-400',
};

const STATUSES = ['', 'live', 'scheduled', 'ended', 'cancelled'];

export default function LivestreamsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-streams', page, status],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      const { data } = await api.get('/admin/streams', { params });
      return data.data as { streams: Stream[]; total: number; totalPages: number };
    },
  });

  const terminateMut = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/streams/${id}/terminate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-streams'] }),
    onError: (err) => setError(extractError(err)),
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.TERMINATE_STREAMS}>
      <TopBar title="Livestream Monitoring" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Radio size={18} className="text-slate-400" />
          {STATUSES.map((s) => (
            <button
              key={s || 'all'}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`rounded-full px-3 py-1 text-sm ${status === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              {s === '' ? 'All' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        {isLoading ? (
          <PageLoader />
        ) : !data || data.streams.length === 0 ? (
          <p className="text-slate-400">No streams.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-left text-slate-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Viewers</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.streams.map((s) => (
                  <tr key={s._id} className="text-slate-200">
                    <td className="px-4 py-3">{s.title}</td>
                    <td className="px-4 py-3">{s.sellerId?.displayName || s.sellerId?.username || '—'}</td>
                    <td className="px-4 py-3">{s.status === 'live' ? (s.currentViewers ?? 0) : s.totalViewers}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[s.status] || ''}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                      {s.status === 'live' && (
                        <Button size="sm" variant="danger" onClick={() => terminateMut.mutate(s._id)}>
                          <StopCircle size={14} /> Terminate
                        </Button>
                      )}
                      {s.status === 'ended' && s.recordingStatus === 'ready' && s.recordingUrl && (
                        <a href={s.recordingUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Play Replay
                          </Button>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
