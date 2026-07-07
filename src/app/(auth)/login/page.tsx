'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap } from 'lucide-react';
import { useAuth, extractError } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

function LoginContent() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const resetSuccess = searchParams.get('reset') === 'success';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard/users');
  }, [isLoading, isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      router.replace('/dashboard/users');
    } catch (err) {
      setServerError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-100">BidsRush</p>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h1 className="text-xl font-semibold text-slate-100 mb-1">Sign in</h1>
          <p className="text-sm text-slate-400 mb-6">Enter your admin credentials to continue</p>

          {resetSuccess && (
            <p className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400">
              Password reset successfully. Sign in with your new password.
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="admin@bidsrush.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="mt-1 text-right">
                <a
                  href="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {serverError && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={submitting}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
