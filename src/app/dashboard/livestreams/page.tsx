'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Radio, StopCircle, Pencil, Trash2 } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { TimeframeFilter, Timeframe } from '@/components/ui/TimeframeFilter';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';

interface Stream {
  _id: string;
  title: string;
  description?: string;
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
  const [timeframe, setTimeframe] = useState<Timeframe>('lifetime');
  const [error, setError] = useState('');

  // Edit States
  const [editTarget, setEditTarget] = useState<Stream | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-streams', page, status, timeframe],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      if (timeframe !== 'lifetime') params.timeframe = timeframe;
      const { data } = await api.get('/admin/streams', { params });
      return data.data as { streams: Stream[]; total: number; totalPages: number };
    },
  });

  const terminateMut = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/streams/${id}/terminate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-streams'] }),
    onError: (err) => setError(extractError(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, title, description, status }: { id: string; title: string; description: string; status: string }) =>
      api.patch(`/admin/streams/${id}`, { title, description, status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-streams'] }),
      setEditTarget(null);
      setError('');
    },
    onError: (err) => setError(extractError(err)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/streams/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-streams'] }),
      setError('');
    },
    onError: (err) => setError(extractError(err)),
  });

  const handleOpenEdit = (stream: Stream) => {
    setEditTarget(stream);
    setEditTitle(stream.title);
    setEditDescription(stream.description || '');
    setEditStatus(stream.status);
    setError('');
  };

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.TERMINATE_STREAMS}>
      <TopBar title="Livestream Monitoring" />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <Radio size={18} className="text-slate-400 mr-1" />
            <span className="text-xs text-slate-400 mr-1 font-medium">Status:</span>
            {STATUSES.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${status === s ? 'bg-blue-600 text-white' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'}`}
              >
                {s === '' ? 'All' : s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <TimeframeFilter value={timeframe} onChange={(val) => { setTimeframe(val); setPage(1); }} />
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
                      <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(s)}>
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${s.title}"?`)) {
                          deleteMut.mutate(s._id);
                        }
                      }}>
                        <Trash2 size={14} /> Delete
                      </Button>
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

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Livestream"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!editTarget) return;
            updateMut.mutate({
              id: editTarget._id,
              title: editTitle,
              description: editDescription,
              status: editStatus,
            });
          }}
          className="flex flex-col gap-4 text-slate-200"
        >
          <Input
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600"
              rows={3}
              placeholder="Stream description..."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">
              Status
            </label>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-850 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={updateMut.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </ProtectedRoute>
  );
}
