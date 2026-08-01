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

const PERIODS = [
  { label: '7D',  days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

function PeriodToggle({
  value,
  onChange,
}: {
  value: number;
  onChange: (d: number) => void;
}) {
  return (
    <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs font-medium">
      {PERIODS.map((p) => (
        <button
          key={p.days}
          onClick={() => onChange(p.days)}
          className={`rounded-md px-3 py-1.5 transition-colors ${
            value === p.days
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

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

export default function AnalyticsPage() {
  const [revenueDays, setRevenueDays] = useState(30);
  const [usersDays, setUsersDays] = useState(30);
  const [streamsDays, setStreamsDays] = useState(30);

  // Overview KPIs
  const overviewQuery = useQuery({
    queryKey: ['admin-analytics-overview'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/overview');
      return data.data as AdminOverview;
    },
    staleTime: 60_000,
  });

  // Revenue & Orders trend
  const revenueQuery = useQuery({
    queryKey: ['admin-analytics-revenue', revenueDays],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/revenue', { params: { days: revenueDays } });
      return data.data as RevenueTrend[];
    },
  });

  // User registrations trend
  const usersQuery = useQuery({
    queryKey: ['admin-analytics-users', usersDays],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/users-trend', { params: { days: usersDays } });
      return data.data as UserTrend[];
    },
  });

  // Streams activity trend
  const streamsQuery = useQuery({
    queryKey: ['admin-analytics-streams', streamsDays],
    queryFn: async () => {
      const { data } = await api.get('/analytics/admin/streams-trend', { params: { days: streamsDays } });
      return data.data as StreamTrend[];
    },
  });

  const overview = overviewQuery.data;

  // Compute total revenue in selected trend period for subtitle
  const periodRevenue = (revenueQuery.data ?? []).reduce((s, d) => s + d.revenue, 0);
  const periodOrders  = (revenueQuery.data ?? []).reduce((s, d) => s + d.orders, 0);
  const periodUsers   = (usersQuery.data ?? []).reduce((s, d) => s + d.newUsers, 0);
  const periodStreams  = (streamsQuery.data ?? []).reduce((s, d) => s + d.newStreams, 0);

  return (
    <ProtectedRoute permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
      <TopBar title="Analytics" subtitle="Platform performance metrics" />

      <div className="space-y-8 p-6">

        {/* ── KPI Cards ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Platform Overview"
            subtitle="Live snapshot of key platform metrics"
            action={
              <button
                onClick={() => overviewQuery.refetch()}
                disabled={overviewQuery.isFetching}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:opacity-50"
              >
                <RefreshCw size={12} className={overviewQuery.isFetching ? 'animate-spin' : ''} />
                Refresh
              </button>
            }
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
                    sub="Registered accounts"
                  />
                  <KpiCard
                    label="Total Sellers"
                    value={overview?.totalSellers.toLocaleString() ?? '0'}
                    icon={Store}
                    accent="purple"
                    sub="Approved sellers"
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
                    sub="All time"
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
                    sub="All time"
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
                  ? `£${periodRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })} revenue · ${periodOrders} orders in last ${revenueDays}d`
                  : 'Daily revenue (area) and order count (bars)'
              }
              action={<PeriodToggle value={revenueDays} onChange={setRevenueDays} />}
            />
            {revenueQuery.isLoading ? (
              <ChartSkeleton height={260} />
            ) : revenueQuery.isError ? (
              <div className="flex h-56 items-center justify-center text-sm text-red-400">
                Failed to load revenue data.
              </div>
            ) : (
              <RevenueChart data={revenueQuery.data ?? []} />
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
                  ? `${periodUsers} new users in last ${usersDays}d`
                  : 'Daily new registrations'
              }
              action={
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-400" />
                  <PeriodToggle value={usersDays} onChange={setUsersDays} />
                </div>
              }
            />
            {usersQuery.isLoading ? (
              <ChartSkeleton height={220} />
            ) : usersQuery.isError ? (
              <div className="flex h-48 items-center justify-center text-sm text-red-400">
                Failed to load user trend.
              </div>
            ) : (
              <UserGrowthChart data={usersQuery.data ?? []} />
            )}
          </ChartCard>

          {/* Stream Activity */}
          <ChartCard>
            <SectionHeader
              title="Stream Activity"
              subtitle={
                streamsQuery.isSuccess
                  ? `${periodStreams} streams started in last ${streamsDays}d`
                  : 'Daily new livestreams created'
              }
              action={
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-orange-400" />
                  <PeriodToggle value={streamsDays} onChange={setStreamsDays} />
                </div>
              }
            />
            {streamsQuery.isLoading ? (
              <ChartSkeleton height={220} />
            ) : streamsQuery.isError ? (
              <div className="flex h-48 items-center justify-center text-sm text-red-400">
                Failed to load streams trend.
              </div>
            ) : (
              <StreamsChart data={streamsQuery.data ?? []} />
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
