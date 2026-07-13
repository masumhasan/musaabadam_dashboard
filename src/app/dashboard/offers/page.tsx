'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api from '@/lib/api';

interface Offer {
  _id: string;
  status: string;
  amount: number;
  createdAt: string;
  buyerId?: { username?: string; displayName?: string };
  sellerId?: { username?: string; displayName?: string };
  productId?: { title?: string };
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  accepted: 'bg-emerald-500/15 text-emerald-400',
  declined: 'bg-red-500/15 text-red-400',
  cancelled: 'bg-slate-500/15 text-slate-400',
};

const STATUSES = ['', 'pending', 'accepted', 'declined', 'cancelled'];

export default function OffersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-offers', page, status],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      const { data } = await api.get('/admin/offers', { params });
      return data.data as { offers: Offer[]; total: number; totalPages: number };
    },
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Offers" subtitle="Monitor platform offers" />
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Tag size={18} className="text-slate-400" />
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
        ) : !data || data.offers.length === 0 ? (
          <p className="text-slate-400">No offers found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-left text-slate-400">
                <tr>
                  <th className="px-4 py-3">Offer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.offers.map((o) => (
                  <tr key={o._id} className="text-slate-200">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{o._id.slice(-8)}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]">{o.productId?.title || '—'}</td>
                    <td className="px-4 py-3">{o.buyerId?.displayName || o.buyerId?.username || '—'}</td>
                    <td className="px-4 py-3">{o.sellerId?.displayName || o.sellerId?.username || '—'}</td>
                    <td className="px-4 py-3">£{o.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] || ''}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {data && data.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination page={page} totalPages={data.totalPages} total={data.total} limit={20} onChange={setPage} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
