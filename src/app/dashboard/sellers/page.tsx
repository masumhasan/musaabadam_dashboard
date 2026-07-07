'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Badge, sellerStatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Spinner';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';
import type { User, PaginatedResponse, ApiResponse } from '@/types';
import { useForm } from 'react-hook-form';

type ModalType = 'reject' | 'info' | null;

function useSellers(params: Record<string, string | number>) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );
  return useQuery({
    queryKey: ['admin-sellers', cleanParams],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<User>>>('/admin/sellers', { params: cleanParams });
      return data.data;
    },
  });
}

export default function SellersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('pending');
  const [modal, setModal] = useState<{ type: ModalType; user: User | null }>({ type: null, user: null });
  const [actionError, setActionError] = useState('');

  const { data, isLoading } = useSellers({ page, limit: 20, status: filter });
  const { register, handleSubmit, reset } = useForm<{ reason: string }>();

  const approveMut = useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/sellers/${userId}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-sellers'] }),
    onError: (err) => setActionError(extractError(err)),
  });

  const rejectMut = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.patch(`/admin/sellers/${userId}/reject`, { reason }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); closeModal(); },
    onError: (err) => setActionError(extractError(err)),
  });

  const infoMut = useMutation({
    mutationFn: ({ userId, note }: { userId: string; note: string }) =>
      api.patch(`/admin/sellers/${userId}/request-info`, { note }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); closeModal(); },
    onError: (err) => setActionError(extractError(err)),
  });

  const closeModal = () => { setModal({ type: null, user: null }); setActionError(''); reset(); };

  const onSubmit = handleSubmit((values) => {
    if (!modal.user) return;
    setActionError('');
    if (modal.type === 'reject') rejectMut.mutate({ userId: modal.user._id, reason: values.reason });
    else if (modal.type === 'info') infoMut.mutate({ userId: modal.user._id, note: values.reason });
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.APPROVE_SELLERS}>
      <TopBar title="Seller Approvals" subtitle="Review and action seller applications" />
      <div className="p-6 space-y-4">
        {/* Status filter tabs */}
        <div className="flex gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1 w-fit">
          {['pending', 'approved', 'rejected', 'needs_more_information'].map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {s === 'needs_more_information' ? 'Needs Info' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {isLoading ? <PageLoader /> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">Seller</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.sellers?.map((user) => {
                  const { label, variant } = sellerStatusBadge(user.sellerProfile?.status ?? '');
                  return (
                    <tr key={user._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-200">{user.displayName || user.username}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{user.sellerProfile?.primaryCategory || '—'}</td>
                      <td className="px-4 py-3"><Badge variant={variant}>{label}</Badge></td>
                      <td className="px-4 py-3 text-slate-500">
                        {user.sellerProfile?.appliedAt ? new Date(user.sellerProfile.appliedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {user.sellerProfile?.status === 'pending' && (
                            <>
                              <Button size="sm" variant="ghost" loading={approveMut.isPending}
                                onClick={() => approveMut.mutate(user._id)}>
                                <CheckCircle size={14} /> Approve
                              </Button>
                              <Button size="sm" variant="ghost"
                                onClick={() => { setModal({ type: 'info', user }); setActionError(''); }}>
                                <Info size={14} /> Info
                              </Button>
                              <Button size="sm" variant="ghost"
                                onClick={() => { setModal({ type: 'reject', user }); setActionError(''); }}>
                                <XCircle size={14} /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {data && (
            <div className="border-t border-slate-800 px-4">
              <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onChange={setPage} />
            </div>
          )}
        </div>
      </div>

      <Modal open={!!modal.type} onClose={closeModal}
        title={modal.type === 'reject' ? 'Reject Application' : 'Request More Information'}>
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-sm text-slate-400">
            Seller: <span className="text-slate-200 font-medium">{modal.user?.email}</span>
          </p>
          <Input label={modal.type === 'reject' ? 'Rejection reason' : 'What information is needed?'}
            placeholder="Provide details…" {...register('reason', { required: true })} />
          {actionError && <p className="text-sm text-red-400">{actionError}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="danger" loading={rejectMut.isPending || infoMut.isPending}>Confirm</Button>
          </div>
        </form>
      </Modal>
    </ProtectedRoute>
  );
}
