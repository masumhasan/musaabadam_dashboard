'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserCheck, Shield, BarChart2, LogOut, Zap, Tag, Package, Settings, Flag, ShoppingBag, Banknote, Radio } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_PERMISSIONS } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Users', href: '/dashboard/users', icon: <Users size={18} />, permission: ADMIN_PERMISSIONS.VIEW_USERS },
  { label: 'Seller Approvals', href: '/dashboard/sellers', icon: <UserCheck size={18} />, permission: ADMIN_PERMISSIONS.APPROVE_SELLERS },
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart2 size={18} />, permission: ADMIN_PERMISSIONS.VIEW_ANALYTICS },
  { label: 'Products', href: '/dashboard/products', icon: <Package size={18} /> },
  { label: 'Orders', href: '/dashboard/orders', icon: <ShoppingBag size={18} />, permission: ADMIN_PERMISSIONS.VIEW_ANALYTICS },
  { label: 'Payouts', href: '/dashboard/payouts', icon: <Banknote size={18} />, permission: ADMIN_PERMISSIONS.APPROVE_PAYOUTS },
  { label: 'Livestreams', href: '/dashboard/livestreams', icon: <Radio size={18} />, permission: ADMIN_PERMISSIONS.TERMINATE_STREAMS },
  { label: 'Categories', href: '/dashboard/categories', icon: <Tag size={18} />, permission: ADMIN_PERMISSIONS.MANAGE_CATEGORIES },
  { label: 'Reports', href: '/dashboard/reports', icon: <Flag size={18} />, permission: ADMIN_PERMISSIONS.VIEW_REPORTS },
  { label: 'Admins', href: '/dashboard/admins', icon: <Shield size={18} />, permission: ADMIN_PERMISSIONS.MANAGE_ADMINS },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { admin, logout, hasPermission } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Backdrop for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-60 flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100">BidsRush</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin info + logout */}
      <div className="border-t border-slate-800 p-3">
        {admin && (
          <div className="mb-2 rounded-lg bg-slate-800 px-3 py-2.5">
            <p className="text-sm font-medium text-slate-200 truncate">
              {admin.firstName} {admin.lastName}
            </p>
            <p className="text-xs text-slate-500 truncate">{admin.role.replace('_', ' ')}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
      </aside>
    </>
  );
}
