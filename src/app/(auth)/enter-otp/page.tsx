'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, ArrowLeft } from 'lucide-react';
import api, { extractError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

function EnterOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [serverError, setServerError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [resetToken, setResetToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const verifyOtp = async () => {
    const otpStr = otp.join('');
    if (otpStr.length < 6) { setOtpError('Enter all 6 digits'); return; }
    setOtpError('');
    setServerError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/admin/auth/verify-reset-otp', { email, otp: otpStr });
      setResetToken(data.data.resetToken);
      setStep('password');
    } catch (err) {
      setServerError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    setResendMsg('');
    setServerError('');
    try {
      await api.post('/admin/auth/forgot-password', { email });
      setResendMsg('A new code has been sent.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setServerError(extractError(err));
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onResetSubmit = async (data: FormData) => {
    setServerError('');
    setSubmitting(true);
    try {
      await api.post('/admin/auth/reset-password', {
        resetToken,
        newPassword: data.newPassword,
      });
      router.push('/login?reset=success');
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
          {step === 'otp' ? (
            <>
              <h1 className="text-xl font-semibold text-slate-100 mb-1">Enter your code</h1>
              <p className="text-sm text-slate-400 mb-6">
                We sent a 6-digit code to{' '}
                <span className="text-slate-200 font-medium">{email}</span>
              </p>

              {/* OTP boxes */}
              <div className="flex gap-2 justify-center mb-4" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-xl font-bold rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                ))}
              </div>

              {otpError && <p className="text-sm text-red-400 text-center mb-2">{otpError}</p>}
              {serverError && (
                <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400 mb-3">
                  {serverError}
                </p>
              )}
              {resendMsg && <p className="text-sm text-green-400 text-center mb-2">{resendMsg}</p>}

              <Button className="w-full" size="lg" loading={submitting} onClick={verifyOtp}>
                Verify code
              </Button>

              <p className="mt-4 text-center text-sm text-slate-400">
                Didn&apos;t receive it?{' '}
                <button onClick={resendCode} className="text-blue-400 hover:text-blue-300 font-medium">
                  Resend
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-slate-100 mb-1">Set new password</h1>
              <p className="text-sm text-slate-400 mb-6">Choose a strong password for your account.</p>

              <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-4">
                <Input
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.newPassword?.message}
                  {...register('newPassword')}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />

                {serverError && (
                  <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                    {serverError}
                  </p>
                )}

                <Button type="submit" className="w-full" size="lg" loading={submitting}>
                  Reset password
                </Button>
              </form>
            </>
          )}

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

export default function EnterOtpPage() {
  return (
    <Suspense>
      <EnterOtpContent />
    </Suspense>
  );
}
