'use client';

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  isPaid: boolean;
  createdAt: string;
  buyerId?: { username?: string; displayName?: string };
  sellerId?: { username?: string; displayName?: string };
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-500/15 text-amber-400',
  confirmed:  'bg-blue-500/15 text-blue-400',
  processing: 'bg-blue-500/15 text-blue-400',
  shipped:    'bg-indigo-500/15 text-indigo-400',
  delivered:  'bg-emerald-500/15 text-emerald-400',
  completed:  'bg-emerald-500/15 text-emerald-400',
  cancelled:  'bg-slate-500/15 text-slate-400',
  refunded:   'bg-red-500/15 text-red-400',
};

function displayName(user?: { username?: string; displayName?: string }) {
  return user?.displayName || user?.username || '—';
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders.length) {
    return <p className="py-6 text-center text-sm text-slate-500">No recent orders.</p>;
  }

  return (
    <div>
      {/* Mobile View */}
      <div className="block md:hidden space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">#{o._id.slice(-8).toUpperCase()}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] || 'bg-slate-500/15 text-slate-400'}`}>
                {o.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="text-slate-500">Buyer:</span>
              <span className="text-slate-300 text-right">{displayName(o.buyerId)}</span>
              <span className="text-slate-500">Seller:</span>
              <span className="text-slate-300 text-right">{displayName(o.sellerId)}</span>
              <span className="text-slate-500">Date:</span>
              <span className="text-slate-400 text-right">
                {new Date(o.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Amount</span>
              <span className="font-semibold text-slate-100">£{o.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((o) => (
              <tr key={o._id} className="text-slate-300 transition-colors hover:bg-slate-900/60">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3">{displayName(o.buyerId)}</td>
                <td className="px-4 py-3">{displayName(o.sellerId)}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-100">
                  £{o.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] || 'bg-slate-500/15 text-slate-400'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(o.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
