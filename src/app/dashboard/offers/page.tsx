'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { TimeframeFilter, Timeframe } from '@/components/ui/TimeframeFilter';
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
  const [timeframe, setTimeframe] = useState<Timeframe>('lifetime');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-offers', page, status, timeframe],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      if (timeframe !== 'lifetime') params.timeframe = timeframe;
      const { data } = await api.get('/admin/offers', { params });
      return data.data as { offers: Offer[]; total: number; totalPages: number };
    },
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Offers" subtitle="Monitor platform offers" />
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
            <Tag size={18} className="text-slate-400 mr-1 flex-shrink-0" />
            <span className="text-xs text-slate-400 mr-1 font-medium flex-shrink-0">Status:</span>
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

        {isLoading ? (
          <PageLoader />
        ) : !data || data.offers.length === 0 ? (
          <p className="text-slate-400">No offers found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-slate-800 bg-slate-900">
              {data.offers.map((o) => (
                <div key={o._id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">#{o._id.slice(-8).toUpperCase()}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] || ''}`}>{o.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                    <span className="text-slate-500">Product</span>
                    <span className="text-slate-300 text-right truncate pl-4">{o.productId?.title || '—'}</span>
                    <span className="text-slate-500">Buyer</span>
                    <span className="text-slate-300 text-right">{o.buyerId?.displayName || o.buyerId?.username || '—'}</span>
                    <span className="text-slate-500">Seller</span>
                    <span className="text-slate-300 text-right">{o.sellerId?.displayName || o.sellerId?.username || '—'}</span>
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-400 text-right">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t border-slate-850 pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Amount</span>
                    <span className="font-semibold text-slate-100">£{o.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
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
