'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import api, { extractError } from '@/lib/api';
import { TOKEN_KEY, ADMIN_KEY } from '@/lib/constants';
import type { AdminUser, ApiResponse } from '@/types';

interface AuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) { setIsLoading(false); return; }

    const stored = sessionStorage.getItem(ADMIN_KEY);
    if (stored) {
      try { setAdmin(JSON.parse(stored)); } catch { /* ignore */ }
    }

    api.get<ApiResponse<AdminUser>>('/admin/auth/me')
      .then(({ data }) => {
        setAdmin(data.data);
        sessionStorage.setItem(ADMIN_KEY, JSON.stringify(data.data));
      })
      .catch(() => {
        Cookies.remove(TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_KEY);
        setAdmin(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ token: string; admin: AdminUser }>>(
      '/admin/auth/login',
      { email, password }
    );
    const { token, admin: adminData } = data.data;
    Cookies.set(TOKEN_KEY, token, { expires: 1, sameSite: 'strict' });
    sessionStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
    setAdmin(adminData);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
    window.location.href = '/login';
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!admin) return false;
      if (admin.role === 'super_admin') return true;
      return admin.permissions.includes(permission as never);
    },
    [admin]
  );

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { extractError };
