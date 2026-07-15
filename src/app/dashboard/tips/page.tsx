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

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tips', page],
    queryFn: async () => {
      const params = { page, limit: 20 };
      const { data } = await api.get('/admin/tips', { params });
      return data.data as { tips: Tip[]; total: number; totalPages: number };
    },
  });

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Tips Platform Activity" />
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <Banknote size={18} className="text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-200">Tips Log</h2>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : !data || data.tips.length === 0 ? (
          <p className="text-slate-400">No tips recorded on the platform.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
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
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                          STATUS_STYLES[t.status] || ''
                        }`}
                      >
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
