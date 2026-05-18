import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBg: string;
  trend?: number;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon, iconBg, trend, subtitle }: StatsCardProps) {
  const positive = trend !== undefined && trend >= 0;

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            positive
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      {/* Decorative gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
    </div>
  );
}
