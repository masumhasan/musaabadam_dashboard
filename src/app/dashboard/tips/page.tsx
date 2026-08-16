'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Banknote } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { TimeframeFilter, Timeframe } from '@/components/ui/TimeframeFilter';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api from '@/lib/api';

interface UserInfo {
  username?: string;
  displayName?: string;
  email?: string;
}

interface Tip {
  _id: string;
  buyerId?: UserInfo;
  sellerId?: UserInfo;
  amount: number;
  processingFee: number;
  totalAmount: number;
  message?: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  succeeded: 'bg-emerald-500/15 text-emerald-400',
  failed: 'bg-red-500/15 text-red-400',
};

export default function TipsPage() {
  const [page, setPage] = useState(1);
  const [timeframe, setTimeframe] = useState<Timeframe>('lifetime');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tips', page, timeframe],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (timeframe !== 'lifetime') params.timeframe = timeframe;
      const { data } = await api.get('/admin/tips', { params });
      return data.data as { tips: Tip[]; total: number; totalPages: number; totalAmount: number };
    },
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Tips Platform Activity" />
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Banknote size={18} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-200">Tips Log</h2>
          </div>
          <TimeframeFilter value={timeframe} onChange={(val) => { setTimeframe(val); setPage(1); }} />
        </div>

        {data && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tips Processed</p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400">£{data.totalAmount.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tips Count</p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-200">{data.total} tips</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <PageLoader />
        ) : !data || data.tips.length === 0 ? (
          <p className="text-slate-400">No tips found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-slate-800 bg-slate-900">
              {data.tips.map((t) => (
                <div key={t._id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-200 text-sm">
                        From: {t.buyerId?.displayName || t.buyerId?.username || '—'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        To: {t.sellerId?.displayName || t.sellerId?.username || '—'}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[t.status] || ''}`}>
                      {t.status}
                    </span>
                  </div>
                  {t.message && (
                    <div className="bg-slate-950/40 p-2 rounded border border-slate-800/40 text-xs italic text-slate-400">
                      "{t.message}"
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs pt-1 border-t border-slate-800/20">
                    <span className="text-slate-500">Tip Amount</span>
                    <span className="text-slate-300 text-right">£{t.amount.toFixed(2)}</span>
                    <span className="text-slate-500">Processing Fee</span>
                    <span className="text-slate-300 text-right">£{t.processingFee.toFixed(2)}</span>
                    <span className="text-slate-500">Total Charged</span>
                    <span className="font-semibold text-slate-100 text-right">£{t.totalAmount.toFixed(2)}</span>
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-400 text-right">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Processing Fee</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Message Note</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.tips.map((t) => (
                    <tr key={t._id} className="text-slate-200 hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-300">
                            {t.buyerId?.displayName || t.buyerId?.username || '—'}
                          </p>
                          {t.buyerId?.username && (
                            <p className="text-xs text-slate-500">@{t.buyerId.username}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-300">
                            {t.sellerId?.displayName || t.sellerId?.username || '—'}
                          </p>
                          {t.sellerId?.username && (
                            <p className="text-xs text-slate-500">@{t.sellerId.username}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">
                        £{t.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        £{t.processingFee.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        £{t.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate" title={t.message || ''}>
                        {t.message ? (
                          <span className="italic text-slate-400">"{t.message}"</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[t.status] || ''}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(t.createdAt).toLocaleString()}
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
            <Pagination
              page={page}
              totalPages={data.totalPages}
              total={data.total}
              limit={20}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
