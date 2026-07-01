'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Banknote } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api from '@/lib/api';

interface Payout {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  sellerId?: { username?: string; displayName?: string };
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  processing: 'bg-blue-500/15 text-blue-400',
  paid: 'bg-emerald-500/15 text-emerald-400',
  failed: 'bg-red-500/15 text-red-400',
};

const STATUSES = ['', 'pending', 'processing', 'paid', 'failed'];

export default function PayoutsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payouts', page, status],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      const { data } = await api.get('/admin/payouts', { params });
      return data.data as { payouts: Payout[]; total: number; totalPages: number };
    },
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.APPROVE_PAYOUTS}>
      <TopBar title="Payouts" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Banknote size={18} className="text-slate-400" />
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

        {isLoading ? (
          <PageLoader />
        ) : !data || data.payouts.length === 0 ? (
          <p className="text-slate-400">No payouts.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-left text-slate-400">
                <tr>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.payouts.map((p) => (
                  <tr key={p._id} className="text-slate-200">
                    <td className="px-4 py-3">{p.sellerId?.displayName || p.sellerId?.username || '—'}</td>
                    <td className="px-4 py-3">£{p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 capitalize">{p.provider}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[p.status] || ''}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
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
