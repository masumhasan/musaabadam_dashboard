'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import api, { extractError } from '@/lib/api';
import type { Product, ProductPaginatedResponse, ApiResponse, ListingType, ProductStatus } from '@/types';

const STATUS_OPTIONS: { label: string; value: ProductStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Sold Out', value: 'sold_out' },
  { label: 'Ended', value: 'ended' },
];

const LISTING_OPTIONS: { label: string; value: ListingType | '' }[] = [
  { label: 'All types', value: '' },
  { label: 'Buy It Now', value: 'buy_it_now' },
  { label: 'Auction', value: 'auction' },
  { label: 'Giveaway', value: 'giveaway' },
];

const STATUS_VARIANT: Record<string, 'success' | 'muted' | 'warning' | 'info' | 'default'> = {
  active: 'success',
  draft: 'muted',
  inactive: 'muted',
  sold_out: 'warning',
  reserved: 'info',
  ended: 'default',
};

function sellerName(product: Product): string {
  const s = product.sellerId;
  if (typeof s === 'object' && s !== null) return s.username;
  return String(s);
}

function priceLabel(product: Product): string {
  if (product.listingType === 'auction') return `$${product.startingPrice?.toFixed(2) ?? '—'} start`;
  if (product.listingType === 'giveaway') return 'Free';
  return `$${product.price.toFixed(2)}`;
}

function useProducts(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ProductPaginatedResponse>>('/admin/products', { params });
      return data.data;
    },
  });
}

export default function ProductsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | ''>('');
  const [listingFilter, setListingFilter] = useState<ListingType | ''>('');

  const params: Record<string, string | number> = { page, limit: 20 };
  if (search) params.search = search;
  if (statusFilter) params.status = statusFilter;
  if (listingFilter) params.listingType = listingFilter;

  const { data, isLoading } = useProducts(params);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-products'] });

  const deactivateMut = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/products/${id}/deactivate`),
    onSuccess: invalidate,
    onError: (err) => alert(extractError(err)),
  });

  const activateMut = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/products/${id}/activate`),
    onSuccess: invalidate,
    onError: (err) => alert(extractError(err)),
  });

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <ProtectedRoute>
      <TopBar title="Products" subtitle="Browse and moderate all seller listings" />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 flex-1 min-w-52">
            <Input
              placeholder="Search title or description…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="ghost" onClick={handleSearch}><Search size={16} /></Button>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as ProductStatus | ''); setPage(1); }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={listingFilter}
            onChange={(e) => { setListingFilter(e.target.value as ListingType | ''); setPage(1); }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LISTING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {isLoading ? <PageLoader /> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Seller</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Listed</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.products?.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 max-w-56">
                      <div className="flex items-center gap-2.5">
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt="" className="h-9 w-9 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="h-9 w-9 rounded bg-slate-700 flex-shrink-0" />
                        )}
                        <p className="font-medium text-slate-200 truncate">{product.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{sellerName(product)}</td>
                    <td className="px-4 py-3 text-slate-500 truncate max-w-28">{product.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{product.listingType.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{priceLabel(product)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[product.status] ?? 'default'}>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        {product.status === 'active' ? (
                          <Button size="sm" variant="ghost"
                            loading={deactivateMut.isPending}
                            onClick={() => deactivateMut.mutate(product._id)}>
                            <ToggleRight size={14} /> Deactivate
                          </Button>
                        ) : product.status === 'inactive' || product.status === 'draft' ? (
                          <Button size="sm" variant="ghost"
                            loading={activateMut.isPending}
                            onClick={() => activateMut.mutate(product._id)}>
                            <ToggleLeft size={14} /> Activate
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && data?.products?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      No products match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {data && data.total > 0 && (
            <div className="border-t border-slate-800 px-4">
              <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
