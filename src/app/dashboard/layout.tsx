'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden dark-dashboard">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Top Header */}
          <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <span className="text-sm font-bold text-slate-100">BidsRush Admin</span>
            <div className="w-6" />
          </header>

          <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
