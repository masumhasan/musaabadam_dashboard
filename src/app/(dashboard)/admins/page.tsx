'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import { ADMIN_PERMISSIONS, ADMIN_ROLES } from '@/lib/constants';
import api, { extractError } from '@/lib/api';
import type { AdminRecord, PaginatedResponse, ApiResponse } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'At least 8 characters'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  role: z.enum(['super_admin', 'support_agent', 'moderator', 'finance_admin']),
});
type CreateForm = z.infer<typeof createSchema>;

function useAdmins(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['admin-admins', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<AdminRecord>>>('/admin/admins', { params });
      return data.data;
    },
  });
}

export default function AdminsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState('');

  const { data, isLoading } = useAdmins({ page, limit: 20 });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'support_agent' },
  });

  const createMut = useMutation({
    mutationFn: (body: CreateForm) => api.post('/admin/admins', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-admins'] }); setCreateOpen(false); reset(); setCreateError(''); },
    onError: (err) => setCreateError(extractError(err)),
  });

  const toggleMut = useMutation({
    mutationFn: ({ adminId, action }: { adminId: string; action: string }) =>
      api.patch(`/admin/admins/${adminId}/${action}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-admins'] }),
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.MANAGE_ADMINS}>
      <TopBar
        title="Admin Accounts"
        subtitle="Manage dashboard users"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Admin
          </Button>
        }
      />
      <div className="p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {isLoading ? <PageLoader /> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">Admin</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.admins?.map((admin) => (
                  <tr key={admin._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200">{admin.firstName} {admin.lastName}</p>
                      <p className="text-slate-500 text-xs">{admin.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={admin.role === 'super_admin' ? 'info' : 'default'}>
                        {admin.role.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={admin.isActive ? 'success' : 'muted'}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Button size="sm" variant="ghost" loading={toggleMut.isPending}
                          onClick={() => toggleMut.mutate({ adminId: admin._id, action: admin.isActive ? 'deactivate' : 'activate' })}>
                          {admin.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Create admin modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setCreateError(''); reset(); }} title="Create Admin Account">
        <form onSubmit={handleSubmit((d) => { setCreateError(''); createMut.mutate(d); })} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Role</label>
            <select {...register('role')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {Object.entries(ADMIN_ROLES).map(([, v]) => (
                <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          {createError && <p className="text-sm text-red-400">{createError}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => { setCreateOpen(false); reset(); }}>Cancel</Button>
            <Button type="submit" loading={createMut.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </ProtectedRoute>
  );
}
