import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Pagination } from '../../types';
import { useLeadsStore } from '../../store/leadsStore';

interface PaginationProps {
  pagination: Pagination;
}

export default function PaginationControls({ pagination }: PaginationProps) {
  const { currentPage, totalPages, totalRecords, hasNextPage, hasPrevPage } = pagination;
  const { setPage } = useLeadsStore();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const btnClass = (active = false, disabled = false) =>
    clsx(
      'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150',
      active
        ? 'bg-primary-600 text-white shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
      disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
    );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {Math.min((currentPage - 1) * pagination.limit + 1, totalRecords)}–
          {Math.min(currentPage * pagination.limit, totalRecords)}
        </span>{' '}
        of <span className="font-semibold text-slate-700 dark:text-slate-300">{totalRecords}</span> leads
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          className={btnClass(false, !hasPrevPage)}
          onClick={() => setPage(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, idx) => {
          const prevPage = visiblePages[idx - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;
          return (
            <div key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
              )}
              <button
                className={btnClass(page === currentPage)}
                onClick={() => setPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            </div>
          );
        })}

        {/* Next */}
        <button
          className={btnClass(false, !hasNextPage)}
          onClick={() => setPage(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
