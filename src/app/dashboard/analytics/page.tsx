'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  Radio,
  Video,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ADMIN_PERMISSIONS } from '@/lib/constants';
import api from '@/lib/api';
import { KpiCard, KpiSkeleton } from '@/components/analytics/KpiCard';
import { RevenueChart, ChartSkeleton } from '@/components/analytics/RevenueChart';
import { UserGrowthChart } from '@/components/analytics/UserGrowthChart';
import { StreamsChart } from '@/components/analytics/StreamsChart';
import { RecentOrdersTable } from '@/components/analytics/RecentOrdersTable';
import { TimeframeFilter, Timeframe } from '@/components/ui/TimeframeFilter';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminOverview {
  totalUsers: number;
  totalSellers: number;
  totalStreams: number;
  liveStreams: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    status: string;
    totalAmount: number;
    isPaid: boolean;
    createdAt: string;
    buyerId?: { username?: string; displayName?: string };
    sellerId?: { username?: string; displayName?: string };
  }>;
}

interface RevenueTrend {
  _id: string;
  revenue: number;
  orders: number;
}

interface UserTrend {
  _id: string;
  newUsers: number;
}

interface StreamTrend {
  _id: string;
  newStreams: number;
}

// ─── Period Toggles ───────────────────────────────────────────────────────────

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Chart Card ───────────────────────────────────────────────────────────────

function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function getTimeframeText(tf: Timeframe) {
  switch (tf) {
    case 'daily': return 'today';
    case 'weekly': return 'this week';
    case 'monthly': return 'this month';
    case 'yearly': return 'this year';
    case 'lifetime': return 'all time';
  }
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');

  // Overview KPIs
  const overviewQuery = useQuery({
    queryKey: ['admin-analytics-overview', timeframe],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/overview', { params: { timeframe } });
      return data.data as AdminOverview;
    },
    staleTime: 60_000,
  });

  // Revenue & Orders trend
  const revenueQuery = useQuery({
    queryKey: ['admin-analytics-revenue', timeframe],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/revenue', { params: { timeframe } });
      return data.data as RevenueTrend[];
    },
  });

  // User registrations trend
  const usersQuery = useQuery({
    queryKey: ['admin-analytics-users', timeframe],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/users-trend', { params: { timeframe } });
      return data.data as UserTrend[];
    },
  });

  // Streams activity trend
  const streamsQuery = useQuery({
    queryKey: ['admin-analytics-streams', timeframe],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/streams-trend', { params: { timeframe } });
      return data.data as StreamTrend[];
    },
  });

  const overview = overviewQuery.data;

  // Compute totals
  const periodRevenue = (revenueQuery.data ?? []).reduce((s, d) => s + d.revenue, 0);
  const periodOrders  = (revenueQuery.data ?? []).reduce((s, d) => s + d.orders, 0);
  const periodUsers   = (usersQuery.data ?? []).reduce((s, d) => s + d.newUsers, 0);
  const periodStreams  = (streamsQuery.data ?? []).reduce((s, d) => s + d.newStreams, 0);

  const isFetchingAny = overviewQuery.isFetching || revenueQuery.isFetching || usersQuery.isFetching || streamsQuery.isFetching;

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Analytics" subtitle="Platform performance metrics" />

      <div className="space-y-8 p-6">

        {/* ── Global Filter Bar ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-200">Timeframe Filter</span>
          </div>
          <div className="flex items-center gap-4">
            <TimeframeFilter value={timeframe} onChange={setTimeframe} showIcon={false} />
            <button
              onClick={() => {
                overviewQuery.refetch();
                revenueQuery.refetch();
                usersQuery.refetch();
                streamsQuery.refetch();
              }}
              disabled={isFetchingAny}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:opacity-50"
            >
              <RefreshCw size={12} className={isFetchingAny ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Platform Overview"
            subtitle="Snapshot of key platform metrics"
          />

          {overviewQuery.isError ? (
            <p className="rounded-xl border border-red-900/40 bg-red-950/30 p-4 text-sm text-red-400">
              Failed to load overview data. Check that the backend is running.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              {overviewQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
              ) : (
                <>
                  <KpiCard
                    label="Total Users"
                    value={overview?.totalUsers.toLocaleString() ?? '0'}
                    icon={Users}
                    accent="blue"
                    sub={timeframe === 'lifetime' ? 'All time registered' : 'New registered'}
                  />
                  <KpiCard
                    label="Total Sellers"
                    value={overview?.totalSellers.toLocaleString() ?? '0'}
                    icon={Store}
                    accent="purple"
                    sub={timeframe === 'lifetime' ? 'All time approved' : 'New approved'}
                  />
                  <KpiCard
                    label="Total Revenue"
                    value={`£${(overview?.totalRevenue ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    accent="green"
                    sub="From paid orders"
                  />
                  <KpiCard
                    label="Total Orders"
                    value={overview?.totalOrders.toLocaleString() ?? '0'}
                    icon={ShoppingBag}
                    accent="amber"
                    sub="Paid & pending"
                  />
                  <KpiCard
                    label="Live Now"
                    value={overview?.liveStreams ?? 0}
                    icon={Radio}
                    accent="red"
                    sub="Active streams"
                  />
                  <KpiCard
                    label="Total Streams"
                    value={overview?.totalStreams.toLocaleString() ?? '0'}
                    icon={Video}
                    accent="indigo"
                    sub={timeframe === 'lifetime' ? 'All time started' : 'New started'}
                  />
                </>
              )}
            </div>
          )}
        </section>

        {/* ── Revenue & Orders Chart ─────────────────────────────────────── */}
        <section>
          <ChartCard>
            <SectionHeader
              title="Revenue & Orders"
              subtitle={
                revenueQuery.isSuccess
                  ? `£${periodRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })} revenue · ${periodOrders} orders ${getTimeframeText(timeframe)}`
                  : 'Revenue (area) and order count (bars)'
              }
            />
            {revenueQuery.isLoading ? (
              <ChartSkeleton height={260} />
            ) : revenueQuery.isError ? (
              <div className="flex h-56 items-center justify-center text-sm text-red-400">
                Failed to load revenue data.
              </div>
            ) : (
              <RevenueChart data={revenueQuery.data ?? []} timeframe={timeframe} />
            )}
          </ChartCard>
        </section>

        {/* ── User Growth + Stream Activity ─────────────────────────────── */}
        <section className="grid gap-6 lg:grid-cols-2">

          {/* User Growth */}
          <ChartCard>
            <SectionHeader
              title="User Growth"
              subtitle={
                usersQuery.isSuccess
                  ? `${periodUsers} new users ${getTimeframeText(timeframe)}`
                  : 'New registrations'
              }
            />
            {usersQuery.isLoading ? (
              <ChartSkeleton height={220} />
            ) : usersQuery.isError ? (
              <div className="flex h-48 items-center justify-center text-sm text-red-400">
                Failed to load user trend.
              </div>
            ) : (
              <UserGrowthChart data={usersQuery.data ?? []} timeframe={timeframe} />
            )}
          </ChartCard>

          {/* Stream Activity */}
          <ChartCard>
            <SectionHeader
              title="Stream Activity"
              subtitle={
                streamsQuery.isSuccess
                  ? `${periodStreams} streams started ${getTimeframeText(timeframe)}`
                  : 'New livestreams created'
              }
            />
            {streamsQuery.isLoading ? (
              <ChartSkeleton height={220} />
            ) : streamsQuery.isError ? (
              <div className="flex h-48 items-center justify-center text-sm text-red-400">
                Failed to load streams trend.
              </div>
            ) : (
              <StreamsChart data={streamsQuery.data ?? []} timeframe={timeframe} />
            )}
          </ChartCard>
        </section>

        {/* ── Recent Orders ─────────────────────────────────────────────── */}
        <section>
          <ChartCard>
            <SectionHeader
              title="Recent Orders"
              subtitle="Last 5 orders across the platform"
            />
            {overviewQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-800/60" />
                ))}
              </div>
            ) : (
              <RecentOrdersTable orders={overview?.recentOrders ?? []} />
            )}
          </ChartCard>
        </section>

      </div>
    </ProtectedRoute>
  );
}
