'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Gift, Ticket, Award, RefreshCw } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import api, { extractError } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const rewardSchema = z.object({
  username: z.string().min(1, 'Username required'),
  title: z.string().min(1, 'Title required'),
  discountType: z.enum(['fixed', 'percentage']),
  discountValue: z.coerce.number().min(1, 'Discount value must be at least 1'),
  minOrderValue: z.coerce.number().min(0, 'Minimum order value cannot be negative').optional(),
  expiresDays: z.coerce.number().min(1, 'Expiry must be at least 1 day'),
});
type RewardForm = z.infer<typeof rewardSchema>;

interface Reward {
  _id: string;
  code: string;
  title: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
  userId?: {
    username: string;
    email: string;
  };
  createdAt: string;
}

export default function RewardsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const { data: rewardsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: async () => {
      const { data } = await api.get<{ data: { rewards: Reward[] } }>('/payments/rewards/admin/list');
      return data.data.rewards;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: RewardForm) => {
      await api.post('/payments/rewards/admin/create', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      setIsAddModalOpen(false);
      reset();
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(extractError(err));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/payments/rewards/admin/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RewardForm>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      discountType: 'fixed',
      discountValue: 10,
      minOrderValue: 15,
      expiresDays: 30,
    },
  });

  const onSubmit = (formData: RewardForm) => {
    createMutation.mutate(formData);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
        <TopBar title="Rewards & Coupons Management" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Rewards</h1>
              <p className="text-sm text-slate-400">Issue discount coupons to users and view rewards list.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="secondary" className="flex items-center gap-1">
                <RefreshCw size={16} /> Refresh
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500">
                <Plus size={16} /> Issue Coupon
              </Button>
            </div>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-4">Title / Code</th>
                    <th className="px-5 py-4">Recipient User</th>
                    <th className="px-5 py-4">Discount</th>
                    <th className="px-5 py-4">Min Spend</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Expiry Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  {rewardsData?.map((reward) => {
                    const isExpired = new Date(reward.expiresAt) < new Date();
                    return (
                      <tr key={reward._id} className="hover:bg-slate-800/40">
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-100">{reward.title}</p>
                            <span className="inline-flex items-center gap-1 mt-1 text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                              <Ticket size={12} /> {reward.code}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {reward.userId ? (
                            <div>
                              <p className="font-medium">@{reward.userId.username}</p>
                              <p className="text-xs text-slate-500">{reward.userId.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-200">
                          {reward.discountType === 'fixed' ? `£${reward.discountValue}` : `${reward.discountValue}%`}
                        </td>
                        <td className="px-5 py-4">
                          £{reward.minOrderValue.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          {reward.isUsed ? (
                            <Badge variant="success" className="bg-emerald-950/40 text-emerald-400 border-emerald-900">Used</Badge>
                          ) : isExpired ? (
                            <Badge variant="danger" className="bg-rose-950/40 text-rose-400 border-rose-900">Expired</Badge>
                          ) : (
                            <Badge variant="info" className="bg-blue-950/40 text-blue-400 border-blue-900">Active</Badge>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {new Date(reward.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Are you sure you want to revoke this coupon?')) {
                                deleteMutation.mutate(reward._id);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 p-1.5"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {!rewardsData?.length && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500">
                        <Gift className="mx-auto mb-2 text-slate-600" size={32} />
                        No coupons issued yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Issue Reward Coupon">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm bg-rose-950/50 text-rose-400 border border-rose-900 rounded-md">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Recipient Username</label>
              <Input {...register('username')} placeholder="e.g. john_doe" className="bg-slate-950 border-slate-800 text-slate-100" />
              {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Coupon Title</label>
              <Input {...register('title')} placeholder="e.g. Welcome Reward Coupon" className="bg-slate-950 border-slate-800 text-slate-100" />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Discount Type</label>
                <select
                  {...register('discountType')}
                  className="w-full h-10 px-3 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="fixed">Fixed (£)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
                {errors.discountType && <p className="text-xs text-rose-500 mt-1">{errors.discountType.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Discount Value</label>
                <Input type="number" {...register('discountValue')} className="bg-slate-950 border-slate-800 text-slate-100" />
                {errors.discountValue && <p className="text-xs text-rose-500 mt-1">{errors.discountValue.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Min. Order Value (£)</label>
                <Input type="number" {...register('minOrderValue')} className="bg-slate-950 border-slate-800 text-slate-100" />
                {errors.minOrderValue && <p className="text-xs text-rose-500 mt-1">{errors.minOrderValue.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Validity (Days)</label>
                <Input type="number" {...register('expiresDays')} className="bg-slate-950 border-slate-800 text-slate-100" />
                {errors.expiresDays && <p className="text-xs text-rose-500 mt-1">{errors.expiresDays.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-500">
                {createMutation.isPending ? 'Issuing...' : 'Issue Coupon'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
