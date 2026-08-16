import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onChange }: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3 text-sm text-slate-400">
      <span className="text-xs sm:text-sm">
        {total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}
      </span>
      <div className="flex items-center gap-1">
        <PageBtn disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={16} />
        </PageBtn>
        <span className="inline-flex items-center px-3 text-xs sm:hidden text-slate-300 font-medium">
          Page {page} of {totalPages || 1}
        </span>
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>
                {p}
              </PageBtn>
            );
          })}
          {totalPages > 7 && page < totalPages - 3 && (
            <>
              <span className="px-1">…</span>
              <PageBtn onClick={() => onChange(totalPages)}>{totalPages}</PageBtn>
            </>
          )}
        </div>
        <PageBtn disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight size={16} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({
  children, active, disabled, onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded px-1.5 text-sm transition-colors',
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
        disabled && 'pointer-events-none opacity-40'
      )}
    >
      {children}
    </button>
  );
}
