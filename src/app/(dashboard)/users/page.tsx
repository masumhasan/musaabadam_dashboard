'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserX, Ban, UserCheck, Trash2 } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, userStatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import { USER_ROLE_LABELS, ADMIN_PERMISSIONS } from '@/lib/constants';
import api, { extractError } from '@/lib/api';
import type { User, PaginatedResponse, ApiResponse } from '@/types';
import { useForm } from 'react-hook-form';

type ActionType = 'suspend' | 'ban' | 'delete' | null;

interface ActionModal {
  type: ActionType;
  user: User | null;
}

function useUsers(params: Record<string, string | number>) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
  );
  return useQuery({
    queryKey: ['admin-users', cleanParams],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<User>>>('/admin/users', { params: cleanParams });
      return data.data;
    },
  });
}

export default function UsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState<ActionModal>({ type: null, user: null });
  const [actionError, setActionError] = useState('');

  const { data, isLoading } = useUsers({ page, limit: 20, search, role, status });
  const { register, handleSubmit, reset } = useForm<{ reason: string; days: string }>();

  const suspendMut = useMutation({
    mutationFn: ({ userId, reason, days }: { userId: string; reason: string; days: number }) =>
      api.patch(`/admin/users/${userId}/suspend`, { reason, days }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
    onError: (err) => setActionError(extractError(err)),
  });

  const banMut = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.patch(`/admin/users/${userId}/ban`, { reason }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
    onError: (err) => setActionError(extractError(err)),
  });

  const activateMut = useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/activate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
    onError: (err) => setActionError(extractError(err)),
  });

  const deleteMut = useMutation({
    mutationFn: (userId: string) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
    onError: (err) => setActionError(extractError(err)),
  });

  const closeModal = () => { setModal({ type: null, user: null }); setActionError(''); reset(); };

  const onActionSubmit = handleSubmit((values) => {
    if (!modal.user) return;
    setActionError('');
    if (modal.type === 'suspend') {
      suspendMut.mutate({ userId: modal.user._id, reason: values.reason, days: Number(values.days) || 7 });
    } else if (modal.type === 'ban') {
      banMut.mutate({ userId: modal.user._id, reason: values.reason });
    } else if (modal.type === 'delete') {
      deleteMut.mutate(modal.user._id);
    }
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_USERS}>
      <TopBar title="Users" subtitle="Manage platform accounts" />
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search email, username…"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All roles</option>
            {Object.entries(USER_ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {isLoading ? <PageLoader /> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.users?.map((user) => {
                  const { label, variant } = userStatusBadge(user);
                  return (
                    <tr key={user._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-200">{user.displayName || user.username}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{USER_ROLE_LABELS[user.role] ?? user.role}</td>
                      <td className="px-4 py-3"><Badge variant={variant}>{label}</Badge></td>
                      <td className="px-4 py-3 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {(user.isBanned || user.isSuspended || !user.isActive) ? (
                            <Button size="sm" variant="ghost" loading={activateMut.isPending}
                              onClick={() => activateMut.mutate(user._id)}>
                              <UserCheck size={14} /> Activate
                            </Button>
                          ) : (
                            <>
                              <Button size="sm" variant="ghost"
                                onClick={() => { setModal({ type: 'suspend', user }); setActionError(''); }}>
                                <UserX size={14} /> Suspend
                              </Button>
                              <Button size="sm" variant="ghost"
                                onClick={() => { setModal({ type: 'ban', user }); setActionError(''); }}>
                                <Ban size={14} /> Ban
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300"
                            onClick={() => { setModal({ type: 'delete', user }); setActionError(''); }}>
                            <Trash2 size={14} /> Delete
                          </Button>
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

      {/* Action modal */}
      <Modal
        open={!!modal.type}
        onClose={closeModal}
        title={modal.type === 'suspend' ? 'Suspend User' : modal.type === 'ban' ? 'Ban User' : 'Delete User'}
      >
        {modal.type === 'delete' ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              This will permanently delete{' '}
              <span className="text-slate-200 font-medium">{modal.user?.email}</span>.
              {' '}This action cannot be undone.
            </p>
            {actionError && <p className="text-sm text-red-400">{actionError}</p>}
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button variant="danger" loading={deleteMut.isPending} onClick={() => modal.user && deleteMut.mutate(modal.user._id)}>
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onActionSubmit} className="space-y-4">
            <p className="text-sm text-slate-400">
              {modal.type === 'suspend' ? 'User will be temporarily suspended.' : 'User will be permanently banned.'}
              {' '}<span className="text-slate-200 font-medium">{modal.user?.email}</span>
            </p>
            <Input label="Reason" placeholder="Provide a reason…" error={actionError || undefined} {...register('reason', { required: true })} />
            {modal.type === 'suspend' && (
              <Input label="Duration (days)" type="number" defaultValue="7" min={1} max={365} {...register('days')} />
            )}
            {actionError && <p className="text-sm text-red-400">{actionError}</p>}
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
              <Button type="submit" variant="danger" loading={suspendMut.isPending || banMut.isPending}>
                Confirm
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </ProtectedRoute>
  );
}
