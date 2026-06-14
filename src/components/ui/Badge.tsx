import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-200',
  success: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  danger: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  muted: 'bg-slate-800 text-slate-400',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function userStatusBadge(user: { isBanned: boolean; isSuspended: boolean; isActive: boolean }) {
  if (user.isBanned) return { label: 'Banned', variant: 'danger' as BadgeVariant };
  if (user.isSuspended) return { label: 'Suspended', variant: 'warning' as BadgeVariant };
  if (!user.isActive) return { label: 'Inactive', variant: 'muted' as BadgeVariant };
  return { label: 'Active', variant: 'success' as BadgeVariant };
}

export function sellerStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Pending', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    suspended: { label: 'Suspended', variant: 'danger' },
    needs_more_information: { label: 'Needs Info', variant: 'info' },
  };
  return map[status] ?? { label: status, variant: 'muted' };
}
