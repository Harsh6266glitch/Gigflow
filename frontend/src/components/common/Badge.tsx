import { clsx } from 'clsx';
import type { LeadStatus, LeadSource } from '../../types';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  New:       { label: 'New',       className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  Contacted: { label: 'Contacted', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  Qualified: { label: 'Qualified', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  Lost:      { label: 'Lost',      className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

const sourceConfig: Record<LeadSource, { label: string; className: string }> = {
  Website:   { label: 'Website',   className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  Instagram: { label: 'Instagram', className: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
  Referral:  { label: 'Referral',  className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' },
};

interface StatusBadgeProps { status: LeadStatus; }
interface SourceBadgeProps { source: LeadSource; }

const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide';

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return <span className={clsx(base, cfg.className)}>{cfg.label}</span>;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const cfg = sourceConfig[source];
  return <span className={clsx(base, cfg.className)}>{cfg.label}</span>;
}
