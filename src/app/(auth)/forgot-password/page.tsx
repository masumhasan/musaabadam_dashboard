'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, ArrowLeft } from 'lucide-react';
import api, { extractError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Valid email required'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setSubmitting(true);
    try {
      await api.post('/admin/auth/forgot-password', { email: data.email });
      // Always navigate regardless of whether email exists (backend hides that)
      router.push(`/enter-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setServerError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-100">BidsRush</p>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h1 className="text-xl font-semibold text-slate-100 mb-1">Reset password</h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter your admin email and we&apos;ll send a 6-digit code.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="admin@bidsrush.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {serverError && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={submitting}>
              Send code
            </Button>
          </form>

          <button
            onClick={() => router.push('/login')}
            className="mt-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
