import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return <Loader2 size={size} className={cn('animate-spin text-blue-400', className)} />;
}

export function PageLoader() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}
